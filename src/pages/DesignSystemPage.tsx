import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';

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
import { AttachVolumeDrawer } from '@/components/AttachVolumeDrawer';
import { DataViewDrawer } from '@/components/DataViewDrawer';
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
  Modal,
  ConfirmModal,
  DetailHeader,
  SectionCard,
  Drawer,
  MonitoringToolbar,
  NotificationCenter,
  FloatingCard,
  Loading,
  WizardSection,
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
  IconPhoto,
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
  // Brand Icons
  IconBrandUbuntu,
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
  IconBoxMultiple2,
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
  IconRobotCustom,
  IconAddRobotCustom,
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
  { id: 'icons', label: 'Icons', icon: IconStar },
  { id: 'app-icons', label: 'App icons', icon: IconApps },
];

// Component items (UI 컴포넌트)
// Form Controls - matches actual content order
const formControlItems = [
  { id: 'button', label: 'Button', icon: IconClick },
  { id: 'input', label: 'Input', icon: IconForms },
  { id: 'filter-search-input', label: 'Filter search Input', icon: IconSearch },
  { id: 'select', label: 'Select', icon: IconSelector },
  { id: 'datepicker', label: 'DatePicker', icon: IconCalendar },
  { id: 'slider', label: 'Slider', icon: IconAdjustments },
  { id: 'chip', label: 'Chip', icon: IconTag },
  { id: 'selection-indicator', label: 'SelectionIndicator', icon: IconSquareCheck },
  { id: 'pagination', label: 'Pagination', icon: IconProgress },
  { id: 'loading', label: 'Loading', icon: IconLoader2 },
  { id: 'toggle', label: 'Toggle', icon: IconToggleRight },
  { id: 'checkbox', label: 'Checkbox', icon: IconSquareCheck },
  { id: 'radio', label: 'Radio', icon: IconCircle },
];

// Navigation & Layout - matches actual content order
const navigationItems = [
  { id: 'topbar', label: 'TopBar', icon: IconLayoutNavbar },
  { id: 'tabbar', label: 'TabBar', icon: IconLayoutNavbar },
  { id: 'tabs', label: 'Tabs', icon: IconLayoutNavbar },
  { id: 'disclosure', label: 'Disclosure', icon: IconSelector },
  { id: 'inline-message', label: 'Inline message', icon: IconInfoCircle },
  { id: 'table', label: 'Table', icon: IconList },
  { id: 'badge', label: 'Badge', icon: IconTag },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: IconChevronRight },
  { id: 'status-indicator', label: 'Status indicator', icon: IconActivity },
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2 },
  { id: 'window-control', label: 'Window control', icon: IconAppWindow },
  { id: 'scrollbar', label: 'Scrollbar', icon: IconLayoutSidebar },
];

// Patterns - matches actual content order
const patternItems = [
  { id: 'detail-header', label: 'Detail header', icon: IconLayoutNavbar },
  { id: 'section-card', label: 'Section card', icon: IconLayoutGrid },
  { id: 'wizard', label: 'Wizard (Create Flow)', icon: IconListNumbers },
  { id: 'menu', label: 'Menu', icon: IconMenu2 },
  { id: 'context-menu', label: 'Context menu', icon: IconMenu2 },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid },
  { id: 'monitoring-toolbar', label: 'Monitoring toolbar', icon: IconRefresh },
  { id: 'notification-center', label: 'Notification center', icon: IconBell },
  { id: 'floating-card', label: 'Floating card', icon: IconLayoutGrid },
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar },
];

// Graphs
const graphItems = [
  { id: 'bar-chart', label: 'Bar chart', icon: IconChartBar },
  { id: 'area-chart', label: 'Area chart', icon: IconChartBar },
  { id: 'pie-chart', label: 'Pie chart', icon: IconActivity },
  { id: 'half-doughnut-chart', label: 'Half-Doughnut chart', icon: IconGauge },
  { id: 'doughnut-chart', label: 'Doughnut chart', icon: IconChartDonut },
];

// All component items
const componentItems = [
  ...formControlItems,
  ...navigationItems,
  ...patternItems,
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
        className="w-[280px]"
      />
      <div className="text-[11px] text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)] p-3 rounded-md">
        <strong>Usage:</strong> Click the input to see available filters. Select a filter type, then enter a value (text) or choose from options (select).
        Applied filters appear as removable tags below the input.
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
      <SectionCard.Header 
        title="Basic information" 
        statusIcon={<WizardSectionStatusIcon status="active" />}
      />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Instance name */}
          <div className="flex flex-col pt-2 pb-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)] mb-2">
              Instance name <span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </label>
            <Input 
              placeholder="Enter instance name" 
              fullWidth 
              value={instanceName}
              onChange={handleInstanceNameChange}
              error={!!instanceNameError}
            />
            <div className="flex flex-col gap-1 mt-1">
              {instanceNameError && (
                <span className="text-[11px] text-[var(--color-state-danger)] leading-[16px]">
                  {instanceNameError}
                </span>
              )}
              <span className="text-[11px] text-[var(--color-text-subtle)] leading-[16px]">
                You can use letters, numbers, and special characters (+=.@-_).
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[var(--color-border-subtle)]" />

          {/* AZ */}
          <VStack gap={2} className="py-6">
            <label className="text-[14px] font-medium text-[var(--color-text-default)]">
              AZ (Availability zone) <span className="ml-1 text-[var(--color-state-danger)]">*</span>
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
            <span className="text-[11px] text-[var(--color-text-subtle)]">
              Select the availability zone for the instance.
            </span>
          </VStack>

          {/* Divider */}
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
  { id: 'e920j10d', status: 'active', name: 'ubuntu-22.04-tk-base', version: '22.04', size: '709.98 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j20d', status: 'active', name: 'ubuntu-20.04-tk-base', version: '20.04', size: '650.00 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'ubuntu' },
  { id: 'e920j30d', status: 'active', name: 'windows-server-2022', version: '2022', size: '4.5 GiB', minDisk: '40.00 GiB', minRam: '4 GiB', access: 'Public', os: 'windows' },
  { id: 'e920j40d', status: 'active', name: 'rocky-8.9-tk-base', version: '8.9', size: '850.11 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'rocky' },
  { id: 'e920j50d', status: 'building', name: 'centos-stream-9', version: '9', size: '920.00 MiB', minDisk: '10.00 MiB', minRam: '0 MiB', access: 'Public', os: 'other' },
];

function OpenSectionTableDemo() {
  const [sourceTab, setSourceTab] = useState<'image' | 'snapshot' | 'volume'>('image');
  const [osFilter, setOsFilter] = useState<'ubuntu' | 'windows' | 'rocky' | 'other'>('other');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceError, setSourceError] = useState<string | null>(null);

  // Filter images
  const filteredImages = demoImages.filter(img => {
    const matchesOs = osFilter === 'other' || img.os === osFilter;
    const matchesSearch = searchQuery === '' || 
      img.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOs && matchesSearch;
  });

  const selectedImage = demoImages.find(img => img.id === selectedImageId);

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
      width: '40px',
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
      width: '64px',
      align: 'center',
      render: (_: unknown, row: DemoImageRow) => (
        <StatusIndicator status={row.status} />
      ),
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      width: '200px',
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
        <SectionCard.Header 
          title="Source" 
          statusIcon={<WizardSectionStatusIcon status="active" />}
          showDivider
        />
      <SectionCard.Content>
        <VStack gap={0}>
          {/* Start Source */}
          <VStack gap={2} className="pt-2">
            <span className="text-[14px] font-medium text-[var(--color-text-default)]">
              Start source<span className="ml-1 text-[var(--color-state-danger)]">*</span>
            </span>
            <span className="text-[12px] text-[var(--color-text-muted)] mb-4">
              Select a template to launch the instance. You can start from an OS image, a snapshot, or an existing volume.
            </span>
            
            {/* Source Tabs */}
            <Tabs value={sourceTab} onChange={(v) => setSourceTab(v as 'image' | 'snapshot' | 'volume')} variant="underline" size="sm">
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
                      onClick={() => { setOsFilter(filter); setCurrentPage(1); }}
                      className={`
                        flex items-center gap-1 px-[10px] py-[6px] rounded-[6px] text-[12px] font-medium leading-5 text-center transition-all
                        ${osFilter === filter
                          ? 'bg-[var(--color-surface-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)] shadow-sm'
                          : 'bg-transparent border border-transparent text-[var(--color-text-default)]'
                        }
                      `}
                    >
                      {filter === 'other' && <IconDots size={14} />}
                      {filter === 'ubuntu' && <IconUbuntu size={14} />}
                      {filter === 'windows' && <IconGrid size={14} />}
                      {filter === 'rocky' && <IconRocky size={14} />}
                      {filter === 'other' ? 'Others' : filter.charAt(0).toUpperCase() + filter.slice(1)}
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
              onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
              size="sm"
              className="w-[280px] mt-2"
            />

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredImages.length / 5) || 1}
              totalItems={filteredImages.length}
              onPageChange={setCurrentPage}
            />

            {/* Table */}
            <div className="w-[806px]">
              <Table
                columns={imageColumns}
                data={filteredImages}
                rowKey="id"
                onRowClick={(row) => handleImageSelect(row.id)}
              />
            </div>

            {/* Error Message or Selection Indicator */}
            {sourceError && !selectedImage ? (
              <div className="mt-2">
                <InlineMessage variant="error">
                  {sourceError}
                </InlineMessage>
              </div>
            ) : (
              <SelectionIndicator
                className="mt-2"
                selectedItems={selectedImage ? [{ id: selectedImage.id, label: selectedImage.name }] : []}
                onRemove={() => setSelectedImageId(null)}
              />
            )}
          </VStack>

          {/* Divider + Next Button */}
          <div className="w-full h-px bg-[var(--color-border-subtle)] mt-6" />
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
    'source': 'writing',
    'flavor': 'pre',
    'network': 'pre',
    'advanced': 'skipped',
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
    setSectionStatus(prev => ({ ...prev, [key]: status }));
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
        <Label>WizardSectionStatusIcon</Label>
        <HStack gap={6}>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="pre" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">pre (대기)</span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="active" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">active (진행 중)</span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="done" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">done (완료)</span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="skipped" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">skipped (건너뜀)</span>
          </HStack>
          <HStack gap={2} align="center">
            <WizardSectionStatusIcon status="writing" />
            <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">writing (작성 중)</span>
          </HStack>
        </HStack>
      </VStack>

      {/* WizardSummary */}
      <VStack gap={3}>
        <Label>WizardSummary</Label>
        <div className="w-[312px]">
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
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">PreSection (대기 중)</span>
            <PreSection title="Source" />
          </VStack>

          {/* WritingSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">WritingSection (작성 중)</span>
            <WritingSection title="Source" />
          </VStack>

          {/* SkippedSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">SkippedSection (건너뜀)</span>
            <SkippedSection title="Advanced" onEdit={() => console.log('Edit clicked')} />
          </VStack>

          {/* DoneSection */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">DoneSection (완료)</span>
            <DoneSection title="Basic information" onEdit={() => console.log('Edit clicked')}>
              <DoneSectionRow label="Instance name" value="my-instance-01" />
              <DoneSectionRow label="AZ" value="nova (Default)" />
              <DoneSectionRow label="Description" value="Test instance for development" />
            </DoneSection>
          </VStack>

          {/* OpenSection (Active) */}
          <VStack gap={1}>
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">OpenSection (열림/활성)</span>
            <OpenSectionDemo />
          </VStack>
        </VStack>

        {/* OpenSection-Table (Active with Table Selection) - Outside max-w container for full table width */}
        <VStack gap={1}>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">OpenSection-Table (테이블 선택)</span>
          <OpenSectionTableDemo />
        </VStack>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive demo</Label>
        <HStack gap={4} align="start">
          {/* Status Controls */}
          <VStack gap={2} className="w-[200px]">
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">Change Status:</span>
            {Object.keys(sectionStatus).map(key => (
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
          <div className="w-[312px]">
            <WizardSummary 
              title="Summary" 
              items={summaryItems}
            />
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
      message: "Flavor's disk is smaller than the minimum size specified in image metadata. Flavor disk is 1073741824 bytes, minimum size is 10737418240 bytes.",
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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
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
            <code>width: 360px</code> · <code>padding: 16px</code> · <code>border-radius: 8px</code> · <code>shadow: lg</code>
          </div>
        </VStack>

        {/* Live Demo */}
        <VStack gap={3}>
          <div className="flex items-center justify-between">
            <Label>Live demo</Label>
            <Button size="sm" variant="secondary" onClick={handleReset} leftIcon={<IconRefresh size={12} />}>
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
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Success</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Operation completed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-danger)] flex items-center justify-center">
                  <IconX size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Error</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Operation failed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-warning)] flex items-center justify-center">
                  <IconAlertTriangle size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Warning</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Attention needed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-info)] flex items-center justify-center">
                  <IconInfoCircle size={10} stroke={2} className="text-white" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Info</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">General information</p>
            </div>
          </div>
        </VStack>

        {/* Features */}
        <VStack gap={3}>
          <Label>Features</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">Tab Filtering</h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Filter notifications by All, Unread, or Error status with counts displayed on each tab.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">Mark as Read</h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Mark individual notifications or all notifications as read with a single click.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">Project Tags</h4>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                Optional project tags help identify which project a notification belongs to.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <h4 className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">Selection State</h4>
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
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Prop</th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Default</th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">notifications</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">NotificationItem[]</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">required</td>
                  <td className="py-2 text-[var(--color-text-default)]">List of notification items</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onMarkAsRead</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">(id: string) =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">Callback when notification is marked as read</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onMarkAllAsRead</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">Callback when all marked as read</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onNotificationClick</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">(n: NotificationItem) =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">Callback when notification is clicked</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">selectedId</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">Currently selected notification id</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onClose</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                  <td className="py-2 text-[var(--color-text-default)]">Callback when panel is closed</td>
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
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Property</th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                  <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Required</th>
                  <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Description</th>
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
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">'success' | 'error' | 'warning' | 'info'</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">Yes</td>
                  <td className="py-2 text-[var(--color-text-default)]">Notification type</td>
                </tr>
                <tr className="border-b border-[var(--color-border-subtle)]">
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">message</td>
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
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">project</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">No</td>
                  <td className="py-2 text-[var(--color-text-default)]">Project name tag</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">isRead</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                  <td className="py-2 pr-4 text-[var(--color-text-muted)]">No</td>
                  <td className="py-2 text-[var(--color-text-default)]">Whether notification has been read</td>
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
    <Section id="datepicker" title="DatePicker" description="Calendar-based date selection with single and range modes">
      <VStack gap={8}>
        {/* Tokens */}
        <VStack gap={3}>
          <Label>Design tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>padding: 12px</code> · <code>gap: 12px</code> · <code>radius: 8px</code> · <code>cell: 32×32px</code>
          </div>
        </VStack>

        {/* Single Selection */}
        <VStack gap={3}>
          <Label>Single Selection {singleDate && <span className="font-normal text-[var(--color-text-muted)]">— {singleDate.toLocaleDateString()}</span>}</Label>
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
          <Label>With Min/Max Date (5th ~ 25th) {minMaxDate && <span className="font-normal text-[var(--color-text-muted)]">— {minMaxDate.toLocaleDateString()}</span>}</Label>
          <DatePicker
            value={minMaxDate}
            onChange={setMinMaxDate}
            minDate={new Date(2025, 2, 5)}
            maxDate={new Date(2025, 2, 25)}
          />
        </VStack>

        {/* Monday Start */}
        <VStack gap={3}>
          <Label>Monday Start {mondayDate && <span className="font-normal text-[var(--color-text-muted)]">— {mondayDate.toLocaleDateString()}</span>}</Label>
          <DatePicker
            firstDayOfWeek={1}
            value={mondayDate}
            onChange={setMondayDate}
          />
        </VStack>

        {/* States */}
        <VStack gap={3}>
          <Label>States</Label>
          <div className="flex gap-4 items-start">
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
              <DatePicker value={singleDate} onChange={setSingleDate} />
            </VStack>
            <VStack gap={1}>
              <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
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
          ${selected === 'left'
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
          ${selected === 'right'
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
      <div className="flex items-center gap-4 w-[312px]">
        <div className="flex-1">
          <Slider
            value={value}
            onChange={setValue}
            min={0}
            max={100}
            step={1}
          />
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
      <div className="flex items-center gap-4 w-[312px]">
        <div className="flex-1">
          <Slider
            value={value}
            onChange={setValue}
            min={0}
            max={1000}
            step={50}
          />
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
   Modal Demo Components
   ---------------------------------------- */

// Basic Modal Demo
function ModalDemo({ variant }: { variant: 'basic' | 'delete' | 'size-sm' | 'size-md' | 'size-lg' }) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonLabel = () => {
    switch (variant) {
      case 'basic': return 'Open Basic Modal';
      case 'delete': return 'Open Delete Modal';
      case 'size-sm': return 'Small (320px)';
      case 'size-md': return 'Medium (400px)';
      case 'size-lg': return 'Large (560px)';
      default: return 'Open Modal';
    }
  };

  const getSize = (): 'sm' | 'md' | 'lg' => {
    if (variant === 'size-sm') return 'sm';
    if (variant === 'size-lg') return 'lg';
    return variant === 'delete' ? 'sm' : 'md';
  };

  if (variant === 'delete') {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          {getButtonLabel()}
        </Button>
        <ConfirmModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log('Deleted!');
            setIsOpen(false);
          }}
          title="Delete Template"
          description="Are you sure you want to delete this template? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          infoLabel="Template name"
          infoValue="My-web-template"
        />
      </>
    );
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {getButtonLabel()}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
        description="This is a modal description that provides additional context."
        size={getSize()}
      >
        <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
          <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
            Modal content goes here. You can put any content inside a modal.
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}

// Modal Use Case Demos
function ModalUseCaseDemo({ useCase }: { useCase: 'delete-single' | 'delete-multiple' | 'disassociate' | 'restore-warning' }) {
  const [isOpen, setIsOpen] = useState(false);

  const config = {
    'delete-single': {
      button: 'Delete (Single)',
      title: 'Delete Security group',
      description: 'Are you sure you want to delete this security group? This action cannot be undone.',
      size: 'sm' as const,
      infoLabel: 'Security group',
      infoValue: 'sg-01',
      hasWarning: true,
      warningText: 'This action will permanently delete the security group and all its rules. If this group is attached to any instances, their network traffic may be affected.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    'delete-multiple': {
      button: 'Delete (Multiple)',
      title: 'Delete Security groups',
      description: 'Are you sure you want to delete the selected security groups?',
      size: 'md' as const,
      infoLabel: 'Security groups (5)',
      infoList: ['sg-01', 'sg-02', 'sg-03', 'sg-04', 'sg-05'],
      hasWarning: true,
      warningText: 'This action will permanently delete the security groups and all their rules.',
      actionText: 'Delete',
      actionVariant: 'danger' as const,
    },
    'disassociate': {
      button: 'Disassociate',
      title: 'Disassociate floating IP',
      description: 'Disassociating will detach the floating IP from the selected resource. External access via this IP will stop immediately.',
      size: 'sm' as const,
      infoLabel: 'Floating IP',
      infoValue: '123.45.67.8',
      secondInfoLabel: 'Associated to',
      secondInfoList: ['Type : Instance', 'Name : server-01', 'Fixed IP : 10.0.0.10'],
      hasWarning: false,
      actionText: 'Disassociate',
      actionVariant: 'primary' as const,
    },
    'restore-warning': {
      button: 'Restore (Disabled)',
      title: 'Restore backup',
      description: 'Large volume backups may impact performance and network throughput.',
      size: 'md' as const,
      infoLabel: 'Volume name',
      infoValue: 'vol-01 (Available)',
      secondInfoLabel: 'Instance name',
      secondInfoList: ['web-server-1 (Running)', 'dev-team (Running)'],
      hasWarning: true,
      warningText: 'Restore cannot proceed. Change the backup status to Available or shut down the attached instance.',
      actionText: 'Restore',
      actionVariant: 'primary' as const,
      disabled: true,
    },
  };

  const c = config[useCase];

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        {c.button}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={c.title}
        description={c.description}
        size={c.size}
      >
        <div className="flex flex-col gap-2">
          {/* Info Box */}
          <div className={`bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5 ${'infoList' in c ? 'max-h-[96px] overflow-y-auto sidebar-scroll' : ''}`}>
            <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
              {c.infoLabel}
            </span>
            {'infoValue' in c && (
              <span className="text-[12px] text-[var(--color-text-default)] leading-4">
                {c.infoValue}
              </span>
            )}
            {'infoList' in c && (
              <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.infoList?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>

          {/* Second Info Box (if exists) */}
          {'secondInfoLabel' in c && (
            <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] px-4 py-3 flex flex-col gap-1.5">
              <span className="text-[11px] text-[var(--color-text-subtle)] font-medium leading-4">
                {c.secondInfoLabel}
              </span>
              <ul className="text-[12px] text-[var(--color-text-default)] leading-4 list-disc pl-4 space-y-0.5">
                {c.secondInfoList?.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          {/* Warning Alert */}
          {c.hasWarning && (
            <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
              <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
              <p className="text-[11px] text-[var(--color-text-default)] leading-4">
                {c.warningText}
              </p>
            </div>
          )}
        </div>

        {/* Button Group */}
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="md" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button 
            variant={c.actionVariant} 
            size="md" 
            onClick={() => setIsOpen(false)} 
            className="flex-1"
            disabled={'disabled' in c && c.disabled}
          >
            {c.actionText}
          </Button>
        </div>
      </Modal>
    </>
  );
}

/* ----------------------------------------
   Drawer Demo (with state)
   ---------------------------------------- */

function DrawerDemo() {
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAttachVolumeOpen, setIsAttachVolumeOpen] = useState(false);
  const [formValue, setFormValue] = useState('');

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Basic Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsBasicOpen(true)}>
        Basic Drawer
      </Button>
      <Drawer
        isOpen={isBasicOpen}
        onClose={() => setIsBasicOpen(false)}
        title="Drawer Title"
        width={376}
      >
        <VStack gap={4}>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-4">
            <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">
              This is a basic drawer with content. Drawers are useful for secondary content, forms, or detail views.
            </p>
          </div>
          <VStack gap={2}>
            <Label>Example content</Label>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              You can put any content inside a drawer, including forms, lists, or details.
            </p>
          </VStack>
        </VStack>
      </Drawer>

      {/* Drawer with Footer */}
      <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
        With button
      </Button>
      <Drawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Edit Settings"
        width={376}
        footer={
          <div className="flex gap-2 w-full">
            <Button variant="secondary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => setIsFormOpen(false)}>
              Save
            </Button>
          </div>
        }
      >
        <VStack gap={4}>
          <VStack gap={2}>
            <label className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">
              Setting Name
            </label>
            <Input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Enter value..."
              fullWidth
            />
          </VStack>
          <div className="bg-[var(--color-surface-subtle)] rounded-[var(--radius-md)] p-3">
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              Drawers with footers are useful for forms with action buttons.
            </p>
          </div>
        </VStack>
      </Drawer>

      {/* Attach volume Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsAttachVolumeOpen(true)}>
        Attach volume
      </Button>
      <AttachVolumeDrawer
        isOpen={isAttachVolumeOpen}
        onClose={() => setIsAttachVolumeOpen(false)}
        instanceName="web-server-10"
        onAttach={(volumeId) => {
          console.log('Attach volume:', volumeId);
          setIsAttachVolumeOpen(false);
        }}
        onCreateNewVolume={() => {
          console.log('Create new volume');
        }}
      />
    </div>
  );
}

/* ----------------------------------------
   Chart Color Palette (from storage-dashboard)
   ---------------------------------------- */

const chartColors = {
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

const primaryChartColors = [
  chartColors.cyan400,
  chartColors.emerald400,
  chartColors.amber400,
  chartColors.violet400,
  chartColors.fuchsia400,
];

/* ----------------------------------------
   Base Chart Options (from storage-dashboard)
   ---------------------------------------- */

const baseChartOptions = {
  animation: false,
  grid: {
    left: '0',
    right: '16px',
    top: '30px',
    bottom: '16px',
    containLabel: true
  },
  xAxis: {
    type: 'category' as const,
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
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      lineStyle: { color: chartColors.slate100, opacity: 0.5 }
    },
    axisLabel: {
      color: chartColors.slate400,
      fontSize: 10
    }
  },
  tooltip: {
    trigger: 'axis' as const,
    backgroundColor: 'white',
    borderColor: '#e2e8f0',
    textStyle: { color: chartColors.slate800, fontSize: 11 },
    formatter: (params: Array<{ marker: string; seriesName: string; value: number; axisValueLabel: string }>) => {
      if (!Array.isArray(params) || params.length === 0) return '';
      const time = params[0].axisValueLabel;
      const items = params.map(p => 
        `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${p.value}</span></div>`
      ).join('');
      return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
    },
    axisPointer: {
      type: 'line',
      snap: true,
      lineStyle: {
        color: chartColors.slate400,
        type: 'dashed'
      }
    }
  }
};

/* ----------------------------------------
   Bar chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

function BarChartDemo({ variant }: { variant: 'vertical' | 'horizontal' | 'grouped' }) {
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
          axisLabel: { color: chartColors.slate400, fontSize: 10 }
        },
        yAxis: {
          type: 'category' as const,
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: chartColors.slate400, fontSize: 10 }
        },
        series: [{
          type: 'bar',
          data: currentData,
          itemStyle: { color: primaryChartColors[0], borderRadius: [0, 4, 4, 0] },
          barWidth: '50%'
        }]
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
          axisLabel: { color: chartColors.slate400, fontSize: 10 }
        },
        yAxis: {
          ...baseChartOptions.yAxis,
          min: 0,
          max: 100
        },
        series: [
          {
            name: 'Current',
            type: 'bar',
            data: currentData,
            itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
            barGap: '10%'
          },
          {
            name: 'Previous',
            type: 'bar',
            data: previousData,
            itemStyle: { color: primaryChartColors[1], borderRadius: [4, 4, 0, 0] }
          }
        ]
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
        axisLabel: { color: chartColors.slate400, fontSize: 10 }
      },
      yAxis: {
        ...baseChartOptions.yAxis,
        min: 0,
        max: 100
      },
      series: [{
        type: 'bar',
        data: currentData,
        itemStyle: { color: primaryChartColors[0], borderRadius: [4, 4, 0, 0] },
        barWidth: '50%'
      }]
    };
  };

  return (
    <div className="w-full bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
      <ReactECharts option={getOption()} style={{ height: variant === 'horizontal' ? '250px' : '200px' }} notMerge={true} opts={{ devicePixelRatio: window.devicePixelRatio }} />
      {variant === 'grouped' && (
        <div className="flex gap-4 mt-2 justify-start">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: primaryChartColors[0] }} />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: primaryChartColors[1] }} />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Previous</span>
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
const generateTimeLabels = () => {
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
const timeOptions = [
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '6h', value: '6h' },
  { label: '12h', value: '12h' },
  { label: '24h', value: '24h' },
];

// Icons for time controls
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


// Helper function for date formatting
const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}.${month}.${day}`;
};

// TimeControls Component
function TimeControls({
  onTimeRangeChange,
  onRefresh
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

function LineChart({ 
  title, 
  series, 
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%',
  onFullScreen,
  isFullScreen = false,
  onExitFullScreen,
  timeControls
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
    Object.fromEntries(series.map(s => [s.name, true]))
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDataView, setShowDataView] = useState(false);

  const timeLabels = generateTimeLabels();

  const allVisible = Object.values(visibleSeries).every(v => v);
  const toggleAll = () => {
    const newState = !allVisible;
    setVisibleSeries(Object.fromEntries(series.map(s => [s.name, newState])));
  };

  const handleFullScreen = () => {
    setMenuOpen(false);
    if (onFullScreen) onFullScreen();
  };

  // Calculate y-axis bounds for exactly 5 labels
  const visibleData = series.filter(s => visibleSeries[s.name]).flatMap(s => s.data);
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
      containLabel: true
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
      max: niceMax,
      interval: yInterval,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: chartColors.slate100, opacity: 0.5 }
      },
      axisLabel: {
        color: chartColors.slate400,
        fontSize: 10,
        formatter: yAxisFormatter
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'white',
      borderColor: '#e2e8f0',
      textStyle: { 
        color: chartColors.slate800, 
        fontSize: 11, 
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif' 
      },
      formatter: (params: Array<{ marker: string; seriesName: string; value: number; axisValueLabel: string; color: string }>) => {
        if (!Array.isArray(params) || params.length === 0) return '';
        const time = params[0].axisValueLabel;
        const items = params.map(p => 
          `<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${p.color};"></span><span>${p.seriesName}</span><span style="font-weight: 500; margin-left: auto;">${yAxisFormatter(p.value)}</span></div>`
        ).join('');
        return `<div style="font-size: 11px;">${time}<div style="margin-top: 4px;">${items}</div></div>`;
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
        <div className="chartWrapper">
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} opts={{ devicePixelRatio: window.devicePixelRatio }} />
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
  series: LineChartSeries[];
  yAxisFormatter: (value: number) => string;
}

// ChartWithFullScreen Wrapper Component
function ChartWithFullScreen({
  title,
  series,
  yAxisFormatter = (v: number) => `${v}`,
  height = '100%'
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
function QuotaBarDemo({ label, used, total, unit }: { label: string; used: number; total: number; unit: string }) {
  const percentage = Math.round((used / total) * 100);
  
  const getColors = () => {
    if (percentage >= 100) return {
      bg: 'bg-[var(--color-status-error)]/15',
      text: 'text-[var(--color-status-error)]'
    };
    if (percentage >= 70) return {
      bg: 'bg-[var(--color-status-warning)]/15',
      text: 'text-[var(--color-status-warning)]'
    };
    return {
      bg: 'bg-[var(--color-status-success)]/15',
      text: 'text-[var(--color-status-success)]'
    };
  };
  
  const colors = getColors();
  
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] font-medium text-[var(--color-text-default)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--font-size-11)] leading-[var(--line-height-16)] text-[var(--color-text-muted)]">{used}/{total} {unit}</span>
          <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
            <span className={`text-[length:var(--font-size-11)] leading-[var(--line-height-16)] font-medium ${colors.text}`}>{percentage}%</span>
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

function AreaChartDemo({ variant }: { variant: 'basic' | 'stacked' | 'nodata' }) {
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
  chartColors.cyan400,     // cyan
  chartColors.emerald400,  // emerald/green
  chartColors.amber400,    // amber/yellow
  chartColors.violet400,   // violet/purple
  chartColors.fuchsia400,  // fuchsia/pink
  chartColors.red400,      // red/coral
  chartColors.slate400,    // slate/gray
  '#60a5fa',               // blue-400
  '#f472b6',               // pink-400
  '#4ade80',               // green-400
];

interface PieChartData {
  name: string;
  value: number;
}

function PieChartDemo({ 
  title, 
  data,
  showPercentOnSlice = true 
}: { 
  title: string; 
  data: PieChartData[];
  showPercentOnSlice?: boolean;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const chartData = data.map((item, index) => ({
    ...item,
    itemStyle: { color: extendedChartColors[index % extendedChartColors.length] }
  }));

  const legendData = data.map((item, index) => ({
    label: item.name,
    value: Math.round((item.value / total) * 100),
    color: extendedChartColors[index % extendedChartColors.length]
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
        fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif'
      },
      formatter: (params: { marker: string; name: string; value: number; percent: number; color: string }) => {
        return `<span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background-color: ${params.color}; margin-right: 6px;"></span>${params.name}<br/><span style="font-weight: 500; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
      }
    },
    animation: false,
    series: [
      {
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: showPercentOnSlice ? {
          show: true,
          position: 'inside',
          formatter: (params: { percent: number }) => {
            return params.percent >= 15 ? `${params.percent.toFixed(0)}%` : '';
          },
          fontSize: 12,
          fontWeight: 600,
          color: '#ffffff',
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif'
        } : {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[280px]">
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">{title}</span>
      <div className="flex justify-center">
        <ReactECharts option={getOption()} style={{ height: '180px', width: '180px' }} opts={{ devicePixelRatio: window.devicePixelRatio }} />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center max-h-[60px] overflow-y-auto legend-scroll">
        {legendData.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------
   Doughnut chart Demo (ECharts - matches SingleValueDoughnutCard from storage)
   ---------------------------------------- */

function DoughnutChartDemo({ 
  title, 
  value,
  color
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
      show: false
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
          borderWidth: 0
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          disabled: true
        },
        data: [
          { value: value, itemStyle: { color: mainColor } },
          { value: 100 - value, itemStyle: { color: bgColor } }
        ]
      }
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
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif'
        }
      }
    ]
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4 w-[280px]">
      <span className="text-[length:var(--font-size-13)] font-medium text-[var(--color-text-default)]">{title}</span>
      <div className="flex justify-center">
        <ReactECharts option={getOption()} style={{ height: '180px', width: '180px' }} opts={{ devicePixelRatio: window.devicePixelRatio }} />
      </div>
    </div>
  );
}

/* ----------------------------------------
   Half-Doughnut chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

function HalfDoughnutChartDemo({ value, label, status = 'default', used, total, unit }: { value: number; label: string; status?: 'default' | 'success' | 'warning' | 'error'; used?: number; total?: number; unit?: string }) {
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
  const availablePercent = total !== undefined && used !== undefined ? Math.round((available / total) * 100) : 0;

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
              [1, getColor('--color-border-subtle', '#f1f5f9')]
            ]
          }
        },
        pointer: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          show: false
        }
      }
    ]
  });

  return (
    <div 
      ref={containerRef}
      className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <ReactECharts option={getOption()} style={{ height: '160px', width: '180px' }} opts={{ devicePixelRatio: window.devicePixelRatio }} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
        <span className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)]">{value}%</span>
        {used !== undefined && total !== undefined ? (
          <span className="text-[12px] text-[var(--color-text-subtle)]">{used}{unit}/{total}{unit}</span>
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
              Used: {used}{unit} ({value}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-[5px] h-[5px] rounded-[1px] bg-[var(--color-border-subtle)]" />
            <span className="text-[11px] leading-[14px] text-[var(--color-text-default)] whitespace-nowrap">
              Available: {available.toFixed(1)}{unit} ({availablePercent}%)
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

function SingleValueDoughnutDemo({ 
  title, 
  value,
  color
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
      show: false
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
          borderWidth: 0
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        emphasis: {
          disabled: true
        },
        data: [
          { value: value, itemStyle: { color: mainColor } },
          { value: 100 - value, itemStyle: { color: bgColor } }
        ]
      }
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
          fontFamily: 'Mona Sans, -apple-system, BlinkMacSystemFont, sans-serif'
        }
      }
    ]
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
      <h4 className="text-[13px] font-medium text-[var(--color-text-default)] mb-2">{title}</h4>
      <ReactECharts option={getOption()} style={{ height: '180px', width: '200px' }} opts={{ devicePixelRatio: window.devicePixelRatio }} />
    </div>
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
          <code>height: 36px</code> · <code>max-width: 160px</code> · <code>padding-x: 12px</code> · <code>font: 12px</code>
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
            Content for: {tabs.find(t => t.id === activeTab)?.label || 'No tab selected'}
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
              { id: 'home', label: 'Home', icon: <IconHome size={14} stroke={1.5} />, closable: false },
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
  { id: 'vm-001', name: 'worker-node-01', status: 'Running', locked: true, fixedIp: '10.20.30.40', floatingIp: '20.30.40.50', image: 'CentOS 7', imageId: 'img-001', flavor: 'Medium', flavorId: 'flv-001', attachedTo: 'web-server-1', attachedToId: 'inst-001', attachedType: 'instance', fingerprint: '02:c1:ff:54:df:d9:69:0e', vCPU: 4, ram: '8GB', disk: '100GB' },
  { id: 'vm-002', name: 'web-server-01', status: 'Running', locked: false, fixedIp: '10.20.30.41', floatingIp: '-', image: 'Ubuntu 22.04', imageId: 'img-002', flavor: 'Large', flavorId: 'flv-002', attachedTo: 'main-router', attachedToId: 'router-001', attachedType: 'router', fingerprint: 'a3:b2:c1:d4:e5:f6:07:18', vCPU: 8, ram: '16GB', disk: '200GB' },
  { id: 'vm-003', name: 'db-master', status: 'Running', locked: true, fixedIp: '10.20.30.42', floatingIp: '20.30.40.52', image: 'Rocky Linux 9', imageId: 'img-003', flavor: 'XLarge', flavorId: 'flv-003', attachedTo: null, attachedToId: null, attachedType: null, fingerprint: '11:22:33:44:55:66:77:88', vCPU: 16, ram: '32GB', disk: '500GB' },
  { id: 'vm-004', name: 'api-gateway', status: 'Stopped', locked: false, fixedIp: '10.20.30.43', floatingIp: '-', image: 'Ubuntu 22.04', imageId: 'img-002', flavor: 'Small', flavorId: 'flv-004', attachedTo: 'log-server', attachedToId: 'inst-003', attachedType: 'instance', fingerprint: 'ff:ee:dd:cc:bb:aa:99:88', vCPU: 2, ram: '4GB', disk: '50GB' },
  { id: 'vm-005', name: 'redis-cache', status: 'Running', locked: false, fixedIp: '10.20.30.44', floatingIp: '20.30.40.54', image: 'Debian 12', imageId: 'img-004', flavor: 'Medium', flavorId: 'flv-001', attachedTo: null, attachedToId: null, attachedType: null, fingerprint: '12:34:56:78:9a:bc:de:f0', vCPU: 4, ram: '8GB', disk: '100GB' },
  { id: 'vm-006', name: 'ml-worker', status: 'Building', locked: false, fixedIp: '-', floatingIp: '-', image: 'Ubuntu 22.04', imageId: 'img-002', flavor: 'GPU Large', flavorId: 'flv-005', attachedTo: 'gpu-server-1', attachedToId: 'inst-005', attachedType: 'instance', fingerprint: 'ab:cd:ef:01:23:45:67:89', vCPU: 8, ram: '64GB', disk: '1TB' },
];

// Sample Key pair data for copy demo
interface KeyPairData {
  id: string;
  name: string;
  fingerprint: string;
  createdAt: string;
}

const sampleKeyPairData: KeyPairData[] = [
  { id: 'kp-001', name: 'tk-keypair', fingerprint: '02:c1:ff:54:df:d9:69:0e:bb:46:a9:c8:0c:dc:2f:bb', createdAt: '2025-09-10' },
  { id: 'kp-002', name: 'dev-keypair', fingerprint: 'a3:b2:c1:d4:e5:f6:07:18:29:3a:4b:5c:6d:7e:8f:90', createdAt: '2025-09-08' },
  { id: 'kp-003', name: 'prod-keypair', fingerprint: '11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00', createdAt: '2025-09-05' },
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
      width: '80px',
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator 
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
        />
      )
    },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true, 
      flex: 1,
      minWidth: '140px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      )
    },
    { 
      key: 'locked', 
      label: 'Locked', 
      width: '68px',
      align: 'center' as const,
      render: (value: boolean) => value ? (
        <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
      ) : null
    },
    { key: 'fixedIp', label: 'Fixed IP', sortable: true, flex: 1, minWidth: '100px' },
    { 
      key: 'image', 
      label: 'Image', 
      sortable: true, 
      flex: 1,
      minWidth: '120px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">ID : {row.imageId}</span>
        </div>
      )
    },
    { 
      key: 'flavor', 
      label: 'Flavor', 
      sortable: true, 
      flex: 1,
      minWidth: '100px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">ID : {row.flavorId}</span>
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Action', 
      width: '64px',
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
      )
    },
  ];

  // Columns with Attached to (external link + resource icon)
  const attachedToColumns = [
    { 
      key: 'name', 
      label: 'Name', 
      width: '180px',
      render: (value: string, row: InstanceData) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
          <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">ID : {row.id}</span>
        </div>
      )
    },
    { key: 'fixedIp', label: 'Fixed IP', width: '120px' },
    { 
      key: 'attachedTo', 
      label: 'Attached to', 
      flex: 1,
      render: (_: string | null, row: InstanceData) => (
        row.attachedTo && row.attachedToId ? (
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <button
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-action-primary)] hover:underline hover:underline-offset-2"
              >
                <span className="truncate">{row.attachedTo}</span>
                <IconExternalLink size={12} className="flex-shrink-0 text-[var(--color-action-primary)]" />
              </button>
              <span className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] truncate">
                ID : {row.attachedToId}
              </span>
            </div>
            <Tooltip content={row.attachedType === 'router' ? 'Router' : 'Instance'} position="top" delay={0}>
              <div 
                className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1"
              >
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
        )
      )
    },
  ];

  // Columns with copy functionality (Key pairs style)
  const copyColumns = [
    { 
      key: 'name', 
      label: 'Name', 
      width: '180px',
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
      )
    },
    { 
      key: 'fingerprint', 
      label: 'Fingerprint', 
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <div className="flex items-center gap-2">
          <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">{row.fingerprint}</span>
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
      )
    },
    { key: 'createdAt', label: 'Created at', width: '140px' },
  ];

  // Columns without copy button (40px row height demo)
  const noCopyColumns = [
    { 
      key: 'name', 
      label: 'Name', 
      width: '180px',
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
      )
    },
    { 
      key: 'fingerprint', 
      label: 'Fingerprint', 
      flex: 1,
      render: (_: string, row: KeyPairData) => (
        <span className="text-[length:var(--font-size-12)] leading-[var(--line-height-18)] text-[var(--color-text-default)]">{row.fingerprint}</span>
      )
    },
    { key: 'createdAt', label: 'Created at', width: '140px' },
  ];

  // Compact columns for horizontal scroll demo
  const compactColumns = [
    { 
      key: 'status', 
      label: 'Status', 
      width: '64px',
      align: 'center' as const,
      render: (value: string) => (
        <StatusIndicator 
          status={value === 'Running' ? 'active' : value === 'Stopped' ? 'error' : 'building'}
          layout="icon-only"
        />
      )
    },
    { 
      key: 'name', 
      label: 'Name', 
      width: '150px',
      render: (value: string) => (
        <span className="font-medium text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
      )
    },
    { key: 'fixedIp', label: 'Fixed IP', width: '110px' },
    { key: 'image', label: 'Image', width: '110px' },
    { key: 'flavor', label: 'Flavor', width: '90px' },
  ];

  // Empty state columns
  const emptyColumns = [
    { key: 'status', label: 'Status', width: '64px' },
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'fixedIp', label: 'Fixed IP', width: '120px' },
    { key: 'image', label: 'Image', width: '120px' },
  ];

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens & Features</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>cell-padding: 12×10px</code> · <code>header-padding: 12×8px</code> · <code>radius: 8px</code> · <code>font: 12px</code>
          <br />
          <span className="text-[var(--color-text-muted)]">Features:</span> <code>overflow-x: auto</code> · <code>text-overflow: ellipsis</code> · <code>title tooltip on hover</code>
        </div>
      </VStack>

      {/* Basic Table */}
      <VStack gap={3}>
        <Label>Basic Table with Sorting</Label>
        <Table
          columns={basicColumns}
          data={sampleTableData}
          rowKey="id"
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click column headers to sort. Status shows icon-only, Name/Image/Flavor show ID below name.
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
        <Table
          columns={attachedToColumns}
          data={sampleTableData}
          rowKey="id"
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Attached to column shows resource type icon (Instance/Router), clickable link opens in new window
        </p>
      </VStack>

      {/* Copy Cell */}
      <VStack gap={3}>
        <Label>Cell with Copy Button</Label>
        <Table
          columns={copyColumns}
          data={sampleKeyPairData}
          rowKey="id"
        />
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          Click copy icon to copy fingerprint. Icon changes to checkmark for 2 seconds after copying.
        </p>
      </VStack>

      {/* 40px Row Height */}
      <VStack gap={3}>
        <Label>40PX</Label>
        <Table
          columns={noCopyColumns}
          data={sampleKeyPairData}
          rowKey="id"
          rowHeight="40px"
        />
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
          <Table
            columns={compactColumns}
            data={sampleTableData.slice(0, 3)}
            rowKey="id"
          />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          • Horizontal scroll: Shift + Mouse wheel or trackpad swipe<br />
          • Long text is truncated with ellipsis (...)<br />
          • Hover over truncated text to see full content via tooltip
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
                  <code className="text-[var(--color-state-danger)]">overflow: auto</code> (부모)<br/>
                  <span className="text-[var(--color-text-subtle)]">부모가 가로+세로 스크롤을 모두 처리하려 해서 테이블 가로 스크롤이 작동 안 함</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--color-state-success)]">✓</span>
                <div>
                  <code className="text-[var(--color-state-success)]">overflow-y: auto; overflow-x: hidden</code> (부모)<br/>
                  <span className="text-[var(--color-text-subtle)]">부모는 세로만 스크롤, 테이블은 가로 스크롤 독립적으로 작동</span>
                </div>
              </div>
            </div>
            <div className="mt-2 p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-sm)] font-mono text-[length:var(--font-size-11)]">
              <span className="text-[var(--color-text-subtle)]">// AppLayout.tsx (Scrollable Content Area)</span><br/>
              <span className="text-[var(--color-action-primary)]">className</span>=<span className="text-[var(--color-state-success)]">"flex-1 overflow-y-auto overflow-x-hidden ..."</span>
            </div>
          </VStack>
        </div>
      </VStack>

      {/* Empty State */}
      <VStack gap={3}>
        <Label>Empty state</Label>
        <Table
          columns={emptyColumns}
          data={[]}
          rowKey="id"
          emptyMessage="No instances found"
        />
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
        rootMargin: '-20% 0px -60% 0px' 
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
    ? navItems.filter(item => 
        item.label.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(sidebarSearchQuery.toLowerCase())
      )
    : [];

  // Filter nav items based on search query (for main content)
  const filteredMainNavItems = mainSearchQuery.trim()
    ? navItems.filter(item => 
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
                        <Icon size={14} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] truncate min-w-0">{label}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-left text-[length:var(--font-size-11)] text-[var(--color-text-muted)] w-full max-w-full min-w-0 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
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
                    ${activeSection === id
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
                    ${activeSection === id
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

            {/* Navigation & Data Display */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Navigation & Data
              </span>
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${activeSection === id
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
                    ${activeSection === id
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

            {/* Patterns */}
            <VStack gap={1} className="w-[166px]">
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Patterns
              </span>
              {patternItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  data-cursor-element-id={`sidebar-nav-${id}`}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors cursor-pointer
                    ${activeSection === id
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
      <main ref={mainRef} className="absolute top-0 bottom-0 right-0 left-[200px] overflow-y-auto">
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
                          <Icon size={16} stroke={1.5} className="text-[var(--color-text-muted)] shrink-0" />
                          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] truncate min-w-0">{label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-left text-[length:var(--font-size-12)] text-[var(--color-text-muted)] w-full max-w-full min-w-0 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                      No results found for "{mainSearchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Token architecture Overview */}
            <Section id="token-architecture" title="Token architecture" description="3-tier design token structure: Primitive → Semantic → Component">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TokenCard
                  title="Primitive"
                  description="Raw design values"
                  items={['Colors (slate, blue, red...)', 'Spacing (0-32)', 'Font Size (10-40px)', 'Radius, Duration, Shadow']}
                  color="var(--color-state-info-bg)"
                  textColor="var(--color-state-info-text)"
                />
                <TokenCard
                  title="Semantic"
                  description="Purpose-driven tokens"
                  items={['Typography (heading, body, label)', 'Color (action, text, surface, border)', 'Spacing (component, layout)', 'Radius (field, button, card)']}
                  color="var(--color-state-success-bg)"
                  textColor="var(--color-state-success-text)"
                />
                <TokenCard
                  title="Component"
                  description="Component-specific tokens"
                  items={['Button (height, padding, gap)', 'Input (height, padding, radius)', 'Badge (padding, radius, dotSize)', 'Menu (item, section, divider)']}
                  color="var(--color-state-warning-bg)"
                  textColor="var(--color-state-warning-text)"
                />
              </div>
            </Section>

            {/* Primitive colors */}
            <Section id="primitive-colors" title="Primitive colors" description="Core color palette used as building blocks">
              <VStack gap={6}>
                {/* Base Colors */}
                <VStack gap={2}>
                  <Label>Base</Label>
                  <div className="flex gap-2">
                    <ColorSwatch name="white" color="var(--color-white)" textLight={false} />
                    <ColorSwatch name="black" color="var(--color-black)" textLight={true} />
                  </div>
                </VStack>
                
                {/* Slate (Cool Neutral) */}
                <VStack gap={2}>
                  <Label>Slate <span className="text-[var(--color-text-subtle)] font-normal">(Cool Neutral - Blue tint)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-slate-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Gray (Pure Neutral) */}
                <VStack gap={2}>
                  <Label>Gray <span className="text-[var(--color-text-subtle)] font-normal">(Pure Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-gray-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Zinc (Warm Neutral) */}
                <VStack gap={2}>
                  <Label>Zinc <span className="text-[var(--color-text-subtle)] font-normal">(Warm Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-zinc-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>

                {/* Neutral (True Neutral) */}
                <VStack gap={2}>
                  <Label>Neutral <span className="text-[var(--color-text-subtle)] font-normal">(True Neutral)</span></Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-neutral-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Blue (Primary) */}
                <VStack gap={2}>
                  <Label>Blue (Primary)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-blue-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Red (Danger) */}
                <VStack gap={2}>
                  <Label>Red (Danger)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-red-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Green (Success) */}
                <VStack gap={2}>
                  <Label>Green (Success)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-green-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Orange (Warning) */}
                <VStack gap={2}>
                  <Label>Orange (Warning)</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 500, 600, 700, 800].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-orange-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
                
                {/* Yellow */}
                <VStack gap={2}>
                  <Label>Yellow</Label>
                  <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                      <ColorSwatch key={shade} name={`${shade}`} color={`var(--color-yellow-${shade})`} textLight={shade >= 500} />
                    ))}
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Semantic colors */}
            <Section id="semantic-colors" title="Semantic colors" description="Purpose-driven color tokens with light/dark theme support">
              <VStack gap={6}>
                {/* Action, Text, Surface, Border */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <VStack gap={3}>
                    <Label>Action</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="primary" color="var(--color-action-primary)" />
                      <SemanticColorBox name="hover" color="var(--color-action-primary-hover)" />
                      <SemanticColorBox name="active" color="var(--color-action-primary-active)" />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Text</Label>
                    <div className="flex gap-2 flex-wrap">
                      <SemanticColorBox name="default" color="var(--color-text-default)" />
                      <SemanticColorBox name="muted" color="var(--color-text-muted)" />
                      <SemanticColorBox name="subtle" color="var(--color-text-subtle)" />
                      <SemanticColorBox name="disabled" color="var(--color-text-disabled)" />
                      <SemanticColorBox name="inverse" color="var(--color-text-inverse)" border />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Surface</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="default" color="var(--color-surface-default)" border />
                      <SemanticColorBox name="subtle" color="var(--color-surface-subtle)" border />
                      <SemanticColorBox name="muted" color="var(--color-surface-muted)" />
                      <SemanticColorBox name="inverse" color="var(--color-surface-inverse)" />
                    </div>
                  </VStack>
                  <VStack gap={3}>
                    <Label>Border</Label>
                    <div className="flex gap-2">
                      <SemanticColorBox name="default" color="var(--color-border-default)" />
                      <SemanticColorBox name="subtle" color="var(--color-border-subtle)" />
                      <SemanticColorBox name="strong" color="var(--color-border-strong)" />
                      <SemanticColorBox name="focus" color="var(--color-border-focus)" />
                    </div>
                  </VStack>
                </div>
                
                {/* State Colors */}
                <VStack gap={3}>
                  <Label>State</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Info */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Info</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-info)" />
                        <SemanticColorBox name="bg" color="var(--color-state-info-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-info-text)" />
                      </div>
                    </VStack>
                    {/* Success */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Success</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-success)" />
                        <SemanticColorBox name="bg" color="var(--color-state-success-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-success-text)" />
                      </div>
                    </VStack>
                    {/* Warning */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Warning</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-warning)" />
                        <SemanticColorBox name="bg" color="var(--color-state-warning-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-warning-text)" />
                      </div>
                    </VStack>
                    {/* Danger */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Danger</span>
                      <div className="flex gap-2">
                        <SemanticColorBox name="default" color="var(--color-state-danger)" />
                        <SemanticColorBox name="bg" color="var(--color-state-danger-bg)" border />
                        <SemanticColorBox name="text" color="var(--color-state-danger-text)" />
                      </div>
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Typography */}
            <Section id="typography" title="Typography" description="Mona Sans based typography system (base: 12px)">
              <VStack gap={8}>
                {/* Headings */}
                <VStack gap={4}>
                  <Label>Headings</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'h1', size: '40px', lh: '48px', weight: '600', desc: 'Hero / Page title' },
                          { token: 'h2', size: '32px', lh: '40px', weight: '600', desc: 'Section title' },
                          { token: 'h3', size: '24px', lh: '32px', weight: '600', desc: 'Card title' },
                          { token: 'h4', size: '18px', lh: '28px', weight: '600', desc: 'Subsection' },
                          { token: 'h5', size: '16px', lh: '24px', weight: '600', desc: 'Small heading' },
                          { token: 'h6', size: '14px', lh: '20px', weight: '500', desc: 'Label heading' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">heading.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
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
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'lg', size: '14px', lh: '20px', weight: '400', desc: 'Large body text' },
                          { token: 'md', size: '12px', lh: '18px', weight: '400', desc: 'Default body text' },
                          { token: 'sm', size: '11px', lh: '16px', weight: '400', desc: 'Small body text' },
                          { token: 'xs', size: '10px', lh: '14px', weight: '400', desc: 'Caption text' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">body.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
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
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Weight</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { token: 'lg', size: '14px', lh: '20px', weight: '500', desc: 'Large label' },
                          { token: 'md', size: '12px', lh: '16px', weight: '500', desc: 'Default label' },
                          { token: 'sm', size: '11px', lh: '16px', weight: '500', desc: 'Small label' },
                        ].map(({ token, size, lh, weight, desc }) => (
                          <tr key={token} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4"><code className="text-[var(--color-action-primary)] font-mono text-[10px]">label.{token}</code></td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{size}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{lh}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{weight}</td>
                            <td className="py-2"><span style={{ fontSize: size, lineHeight: lh, fontWeight: Number(weight) }}>{desc}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Spacing & Radius */}
            <Section id="spacing-radius" title="Spacing & Radius" description="Consistent spacing scale (4px grid) and border radius">
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
                        <div className="w-12 h-12 bg-[var(--color-action-primary)]" style={{ borderRadius: value }} />
                        <code className="text-[9px] font-mono text-[var(--color-text-subtle)]">{name}</code>
                      </VStack>
                    ))}
                  </div>
                </VStack>
              </div>
            </Section>

            {/* Borders */}
            <Section id="borders" title="Borders" description="Border tokens for colors, widths, and styles">
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
                          <p className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">{desc}</p>
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
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with default border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border border-[var(--color-border-default)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with strong border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border-2 border-[var(--color-border-strong)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Dashed border (dropzone)</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border border-dashed</code>
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
            <Section id="shadows" title="Shadows" description="Box shadow tokens for elevation and depth">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'xs', value: '0 1px 2px 0 rgba(0,0,0,0.05)' },
                  { name: 'sm', value: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' },
                  { name: 'md', value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
                  { name: 'lg', value: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)' },
                  { name: 'xl', value: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' },
                ].map(({ name, value }) => (
                  <div key={name} className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)]">
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
            <Section id="icons" title="Icons" description="Tabler Icons & Custom Icons - Stroke width 1.5, Size 16-20px">
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
            <Section id="app-icons" title="App icons" description="Application icons for THAKI Cloud services - Size 64x64">
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
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">{name}</span>
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
            <Section id="button" title="Button" description="Interactive button component with multiple variants, sizes, and states">
              <VStack gap={8}>
                {/* Token Table */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Token</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">SM</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">MD</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">LG</th>
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
                        ].map(({ name, sm, md, lg }) => (
                          <tr key={name} className="border-b border-[var(--color-border-subtle)]">
                            <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">--button-{name}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{sm}</td>
                            <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">{md}</td>
                            <td className="py-2 font-mono text-[var(--color-text-muted)]">{lg}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                    <code>radius: 6px (md)</code> · <code>border: slate-300 (secondary)</code> · <code>disabled-bg: slate-200 (primary)</code>
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
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Height</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">권장 사용처</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium">SM</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">28px</td>
                          <td className="py-2 text-[var(--color-text-muted)]">테이블 툴바, 밀집된 UI, 반복 가능한 보조 액션</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium">MD</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">32px</td>
                          <td className="py-2 text-[var(--color-text-muted)]">일반 폼, 모달/드로어 액션, 독립적인 CTA</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-medium">LG</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">36px</td>
                          <td className="py-2 text-[var(--color-text-muted)]">페이지 주요 CTA, 랜딩 페이지, 히어로 섹션</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1 space-y-1">
                    <div><strong>판단 기준:</strong> 밀집된 UI? → SM | 독립적인 CTA? → MD/LG | 반복 가능한 액션? → SM | 폼의 최종 제출? → MD/LG</div>
                    <div><strong>수직 정렬:</strong> 같은 행에 있는 요소는 같은 사이즈 사용 (Input md + Button md ✓)</div>
                  </div>
                </VStack>

                {/* Variants */}
                <VStack gap={3}>
                  <Label>Variants</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="primary">Primary</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                    <Button size="sm" variant="outline">Outline</Button>
                    <Button size="sm" variant="ghost">Ghost</Button>
                    <Button size="sm" variant="muted">Muted</Button>
                    <Button size="sm" variant="danger">Danger</Button>
                    <Button size="sm" variant="link">Link</Button>
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With icons</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" leftIcon={<IconPlus size={14} />}>Left icon</Button>
                    <Button size="sm" rightIcon={<IconArrowRight size={14} />}>Right icon</Button>
                    <Button size="sm" icon={<IconHeart size={14} />} aria-label="Like" />
                    <Button size="sm" variant="secondary" icon={<IconStar size={14} />} aria-label="Star" />
                  </div>
                  <div className="mt-4"><Label>Icon + Text (Action Buttons)</Label></div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">No selection</span>
                      <Button size="sm" variant="secondary" leftIcon={<IconPlayerPlay size={12} />} disabled>Start</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />} disabled>Create</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />} disabled>Edit</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconTrash size={12} />} disabled>Delete</Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[var(--color-text-subtle)] w-[120px]">With selection</span>
                      <Button size="sm" variant="secondary" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />}>Create</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>Edit</Button>
                      <Button size="sm" variant="secondary" leftIcon={<IconTrash size={12} />}>Delete</Button>
                    </div>
                  </div>
                </VStack>

                {/* States */}
                <VStack gap={3}>
                  <Label>States</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm">Default</Button>
                    <Button size="sm" disabled>Disabled</Button>
                    <Button size="sm" isLoading>Loading</Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="secondary">Default</Button>
                    <Button size="sm" variant="secondary" disabled>Disabled</Button>
                  </div>
                </VStack>

                {/* Polymorphic */}
                <VStack gap={3}>
                  <Label>Polymorphic (as prop)</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" as="a" href="#" target="_blank">As anchor</Button>
                    <Button size="sm" as={Link} to="/">As router link</Button>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Input Component */}
            <Section id="input" title="Input" description="Text fields, textarea, number input, and search">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 28/32px</code> · <code>padding: 10×8px</code> · <code>radius: 6px</code> · <code>font: 11-12px</code> · <code>border: 1px → 2px focus</code>
                  </div>
                </VStack>

                {/* Text Input - Status */}
                <VStack gap={3}>
                  <Label>Text Input - Status</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <Input placeholder="Input placeholder" className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <Input defaultValue="Input value" className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Read-only</span>
                      <Input defaultValue="Input read-only" readOnly className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Input defaultValue="Input disabled" disabled className="w-full" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Error</span>
                      <Input defaultValue="Input error" error="Error message" className="w-full" />
                    </VStack>
                  </div>
                </VStack>

                {/* Text Input - Sizes */}
                <VStack gap={3}>
                  <Label>Text Input - Sizes</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">SM (28px)</span>
                      <Input size="sm" placeholder="Input placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">MD (32px)</span>
                      <Input size="md" placeholder="Input placeholder" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* With Labels & Helpers */}
                <VStack gap={3}>
                  <Label>Labels & Validation</Label>
                  <div className="flex flex-wrap gap-4 items-start">
                    <Input label="Label" placeholder="Enter text..." className="w-[200px]" />
                    <Input label="With helper" placeholder="Email" helperText="We'll never share your email" className="w-[200px]" />
                    <Input label="With error" placeholder="Username" error="Username is required" className="w-[200px]" />
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With icons</Label>
                  <div className="flex gap-4">
                    <Input placeholder="Search..." leftElement={<IconSearch size={14} />} className="w-[200px]" />
                    <Input placeholder="Email" rightElement={<IconMail size={14} />} className="w-[200px]" />
                  </div>
                </VStack>

                {/* Textarea */}
                <VStack gap={3}>
                  <Label>Textarea</Label>
                  <div className="flex gap-4">
                    <Textarea placeholder="Input placeholder" className="w-[280px]" />
                    <Textarea defaultValue="Input value with multiple lines of text content" className="w-[280px]" />
                  </div>
                </VStack>

                {/* Textarea - Code */}
                <VStack gap={3}>
                  <Label>Textarea - Code Variant</Label>
                  <Textarea 
                    variant="code" 
                    placeholder="input user data" 
                    defaultValue={`input user data\n\n`}
                    className="w-[280px]" 
                  />
                </VStack>

                {/* NumberInput (Stepper) */}
                <VStack gap={3}>
                  <Label>Number Input (Stepper)</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <NumberInput defaultValue={1} className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Min/Max</span>
                      <NumberInput defaultValue={5} min={0} max={10} className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <NumberInput defaultValue={1} disabled className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* SearchInput */}
                <VStack gap={3}>
                  <Label>Search input</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">SM (28px)</span>
                      <SearchInput size="sm" placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">MD (32px)</span>
                      <SearchInput size="md" placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

                {/* SearchInput - Status */}
                <VStack gap={3}>
                  <Label>Search Input - Status</Label>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <SearchInput placeholder="Search placeholder" className="w-[200px]" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <SearchInput defaultValue="Search value" className="w-[200px]" />
                    </VStack>
                  </div>
                </VStack>

              </VStack>
            </Section>

            {/* Filter search Input Component */}
            <Section id="filter-search-input" title="Filter search Input" description="Combined search and filter input with tag display for applied filters">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 32px (sm) / 36px (md)</code> · <code>padding: 8×12px</code> · <code>radius: 6px</code> · <code>font: 12px</code> · <code>chip-gap: 4px</code>
                  </div>
                </VStack>

                {/* Features */}
                <VStack gap={3}>
                  <Label>Features</Label>
                  <ul className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)] list-disc list-inside space-y-1">
                    <li>Click input to show available filter options</li>
                    <li>Select filter field, then enter value (text) or select option (select type)</li>
                    <li>Applied filters displayed as removable chips/tags</li>
                    <li>Supports text and select filter types</li>
                    <li>Clear all filters button when filters are applied</li>
                  </ul>
                </VStack>

                {/* Interactive Demo */}
                <VStack gap={3}>
                  <Label>Interactive demo</Label>
                  <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                    Click the input below to see available filters. Select a filter, enter a value, and see it appear as a tag.
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
            <Section id="select" title="Select" description="Dropdown select for choosing from a list of options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 10×8px</code> · <code>radius: 6px</code> · <code>font: 12px</code> · <code>item: 10×6px, 11px</code> · <code>border: 1px → 2px focus</code>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-4 items-start flex-wrap">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Placeholder</span>
                      <Select
                        placeholder="Placeholder"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Value</span>
                      <Select
                        placeholder="Placeholder"
                        defaultValue="active"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Select
                        placeholder="Placeholder"
                        disabled
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Error</span>
                      <Select
                        placeholder="Placeholder"
                        error="Please select an option"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                        className="w-[200px]"
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
                      options={[
                        { value: 'active', label: 'Active' },
                        { value: 'shutoff', label: 'Shutoff' },
                        { value: 'building', label: 'Building' },
                      ]}
                      className="w-[200px]"
                    />
                    <Select
                      label="Region"
                      placeholder="Select region"
                      helperText="Choose your preferred region"
                      options={[
                        { value: 'kr', label: 'Korea' },
                        { value: 'us', label: 'United States' },
                        { value: 'jp', label: 'Japan' },
                      ]}
                      className="w-[200px]"
                    />
                  </div>
                </VStack>

                {/* Size Variants */}
                <VStack gap={3}>
                  <Label>Size variants</Label>
                  <div className="flex gap-4 items-end flex-wrap">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <Select
                        placeholder="Select"
                        defaultValue="active"
                        options={[
                          { value: 'active', label: 'Active' },
                          { value: 'shutoff', label: 'Shutoff' },
                          { value: 'building', label: 'Building' },
                        ]}
                      />
                    </VStack>
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
            <Section id="slider" title="Slider" description="Draggable slider for selecting values within a range">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>track: 6px height</code> · <code>thumb: 16px, 3px border</code> · <code>fill: primary</code>
                  </div>
                </VStack>

                {/* Basic */}
                <VStack gap={3}>
                  <Label>Basic</Label>
                  <div className="w-[312px]">
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <div className="w-[312px]">
                        <Slider defaultValue={30} />
                      </div>
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <div className="w-[312px]">
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
            <Section id="chip" title="Chip" description="Interactive tags for displaying selected values with optional remove action">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 8×4px</code> · <code>gap: 6px</code> · <code>radius: 6px</code> · <code>font: 11px</code>
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <Chip label="Name" value="a" onRemove={() => {}} />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Chip label="Name" value="a" disabled />
                    </VStack>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* SelectionIndicator Component */}
            <Section id="selection-indicator" title="SelectionIndicator" description="Display component for showing table selection state. Supports error state for required selection validation.">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>min-height: 42px</code> · <code>padding: 8×12px</code> · <code>radius: table-row-radius</code> · <code>gap: 16px</code>
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

                {/* Custom Empty Text */}
                <VStack gap={3}>
                  <Label>Custom Empty Text</Label>
                  <SelectionIndicator
                    emptyText="Select a network to continue"
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
                  <SelectionIndicator
                    error
                    errorMessage="Please select a start source."
                  />
                </VStack>

                {/* Error State with Custom Empty Text */}
                <VStack gap={3}>
                  <Label>Error State (uses emptyText as fallback)</Label>
                  <SelectionIndicator
                    error
                    emptyText="Selection is required"
                  />
                </VStack>
              </VStack>
            </Section>

            {/* Pagination Component */}
            <Section id="pagination" title="Pagination" description="Navigation for paginated content">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>item-size: 24px</code> · <code>gap: 4px</code> · <code>radius: 4px</code> · <code>font: 11px</code>
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
                    When rows are selected in a table, the pagination shows "X selected / Y items" format.
                  </p>
                </VStack>
              </VStack>
            </Section>

            {/* Loading Component */}
            <Section id="loading" title="Loading" description="Loading indicators for various states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>spinner: 16/22/32px</code> · <code>progress: h-1</code> · <code>button: min-w-80px</code>
                  </div>
                </VStack>

                {/* Spinner Variant */}
                <VStack gap={3}>
                  <Label>Spinner variant</Label>
                  <div className="flex gap-8 items-end p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Small</span>
                      <Loading variant="spinner" size="sm" text="Loading" />
                    </VStack>
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Medium</span>
                      <Loading variant="spinner" size="md" text="Loading" />
                    </VStack>
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Large</span>
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
            <Section id="toggle" title="Toggle" description="On/Off switch control for binary settings">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>track: 48×24px</code> · <code>thumb: 16×16px</code> · <code>padding: 4px</code> · <code>radius: pill</code> · <code>gap: 8px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Without Label</span>
                      <Toggle defaultChecked />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Toggle label="Bootable" defaultChecked />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Off</span>
                      <Toggle label="Setting" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">On</span>
                      <Toggle label="Setting" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled Off</span>
                      <Toggle label="Setting" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled On</span>
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
              </VStack>
            </Section>

            {/* Checkbox Component */}
            <Section id="checkbox" title="Checkbox" description="Selection control for single or multiple options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 6px</code> · <code>icon: 12px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon Only</span>
                      <Checkbox defaultChecked />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Checkbox label="Label" defaultChecked />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Unselected</span>
                      <Checkbox label="Label" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Selected</span>
                      <Checkbox label="Label" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Indeterminate</span>
                      <Checkbox label="Label" checked indeterminate onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Checkbox label="Label" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled + Checked</span>
                      <Checkbox label="Label" checked disabled />
                    </VStack>
                  </div>
                </VStack>

                {/* Error State */}
                <VStack gap={3}>
                  <Label>Error state</Label>
                  <div className="flex gap-8 items-start">
                    <Checkbox label="Unchecked with error" error errorMessage="This field is required" />
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
            <Section id="radio" title="Radio" description="Single selection control for mutually exclusive options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>dot: 6px</code> · <code>border: 2px</code> · <code>gap: 6px</code>
                  </div>
                </VStack>

                {/* Layout */}
                <VStack gap={3}>
                  <Label>Layout</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon Only</span>
                      <Radio value="icon" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">With Label</span>
                      <Radio label="Label" value="label" checked onChange={() => {}} />
                    </VStack>
                  </div>
                </VStack>

                {/* Status */}
                <VStack gap={3}>
                  <Label>Status</Label>
                  <div className="flex gap-8 items-start">
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Unselected</span>
                      <Radio label="Label" value="unselected" checked={false} onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Selected</span>
                      <Radio label="Label" value="selected" checked onChange={() => {}} />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled</span>
                      <Radio label="Label" value="disabled" disabled />
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Disabled + Selected</span>
                      <Radio label="Label" value="disabled-selected" checked disabled onChange={() => {}} />
                    </VStack>
                  </div>
                </VStack>

                {/* Radio Group */}
                <VStack gap={3}>
                  <Label>Radio group</Label>
                  <div className="flex gap-8 items-start">
                    <RadioGroup label="Select one option" defaultValue="option1" direction="vertical">
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
            <Section id="topbar" title="TopBar" description="Application header with sidebar toggle, navigation, breadcrumb, and actions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>height: 40px</code> · <code>padding-x: 12px</code> · <code>button-size: 28px</code> · <code>radius: 4px</code>
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
            <Section id="tabbar" title="TabBar" description="Browser-style tabs with responsive width (max 160px, auto-shrink when overflow)">
              <TabBarDemo />
            </Section>

            {/* Tabs Component */}
            <Section id="tabs" title="Tabs" description="Tabs for navigation between views with underline and boxed variants">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 24px</code> · <code>min-width: 80px</code> · <code>padding-x: 12px</code> · <code>indicator: 2px</code> · <code>boxed-padding: 24×8px</code>
                  </div>
                </VStack>

                {/* Variants */}
                <VStack gap={3}>
                  <Label>Variants</Label>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Underline (default)</span>
                      <Tabs defaultValue="tab1" size="sm">
                        <TabList>
                          <Tab value="tab1">menu 1</Tab>
                          <Tab value="tab2">menu 2</Tab>
                          <Tab value="tab3">menu 3</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Capsule tab</span>
                      <CapsuleTabDemo />
                    </VStack>
                  </VStack>
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <VStack gap={4}>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Small (12px)</span>
                      <Tabs defaultValue="tab1" size="sm">
                        <TabList>
                          <Tab value="tab1">menu 1</Tab>
                          <Tab value="tab2">menu 2</Tab>
                          <Tab value="tab3">menu 3</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Medium (14px)</span>
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
                      <Tab value="disabled" disabled>Disabled</Tab>
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
            <Section id="disclosure" title="Disclosure" description="Expandable/collapsible content sections">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 6px</code> · <code>icon: 12px</code> · <code>font: 14px / 20px / medium</code>
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
            <Section id="inline-message" title="Inline message" description="Contextual feedback messages for different states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 12px</code> · <code>gap: 8px</code> · <code>radius: 6px</code> · <code>icon: 16px</code> · <code>font: 12px</code>
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
                    This is a longer message that demonstrates how the component handles multi-line content. 
                    The text will wrap naturally and the icon stays aligned to the top.
                  </InlineMessage>
                </VStack>
              </VStack>
            </Section>

            {/* Table Component */}
            <Section id="table" title="Table" description="Data table with sorting, selection, sticky header, text truncation with tooltip, and horizontal scroll">
              <TableDemo />
            </Section>

            {/* Badge Component */}
            <Section id="badge" title="Badge" description="Status indicators and labels with various styles">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-11)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Size</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Padding</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Font Size</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Line Height</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sm</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">6×2px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">11px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">md</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">8×4px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">16px</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">lg</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">12×4px</td>
                          <td className="py-2 pr-4 font-mono text-[var(--color-text-muted)]">14px</td>
                          <td className="py-2 font-mono text-[var(--color-text-muted)]">20px</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)] mt-1">
                    <code>radius: 6px</code> · <code>gap: 4px</code> · <code>dot-size: 6px</code>
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Solid</span>
                      <div className="flex gap-2">
                        <Badge size="sm" type="solid" theme="blue">Blue</Badge>
                        <Badge size="sm" type="solid" theme="green">Green</Badge>
                        <Badge size="sm" type="solid" theme="red">Red</Badge>
                        <Badge size="sm" type="solid" theme="yellow">Yellow</Badge>
                        <Badge size="sm" type="solid" theme="gray">Gray</Badge>
                      </div>
                    </VStack>
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Subtle</span>
                      <div className="flex gap-2">
                        <Badge size="sm" type="subtle" theme="blue">Blue</Badge>
                        <Badge size="sm" type="subtle" theme="green">Green</Badge>
                        <Badge size="sm" type="subtle" theme="red">Red</Badge>
                        <Badge size="sm" type="subtle" theme="yellow">Yellow</Badge>
                        <Badge size="sm" type="subtle" theme="gray">Gray</Badge>
                      </div>
                    </VStack>
                  </div>
                </VStack>

                {/* Layout (with icons) */}
                <VStack gap={3}>
                  <Label>Layout (with Icons)</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" theme="blue">Text only</Badge>
                    <Badge size="sm" theme="blue" leftIcon={<IconCheck size={10} />}>Left icon</Badge>
                    <Badge size="sm" theme="blue" rightIcon={<IconArrowRight size={10} />}>Right icon</Badge>
                  </div>
                </VStack>

                {/* Status Examples */}
                <VStack gap={3}>
                  <Label>Status examples</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" type="solid" theme="green">Running</Badge>
                    <Badge size="sm" type="solid" theme="red">Stopped</Badge>
                    <Badge size="sm" type="solid" theme="yellow">Warning</Badge>
                    <Badge size="sm" type="solid" theme="gray">Unknown</Badge>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Breadcrumb Component */}
            <Section id="breadcrumb" title="Breadcrumb" description="Navigation path indicator with clickable links">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 4px</code> · <code>font-size: 11px</code> · <code>line-height: 16px</code> · <code>font-weight: medium</code>
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
                      <span className="text-[var(--breadcrumb-text-color)] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-[var(--color-text-subtle)]">Hover</span>
                      <span className="text-[var(--breadcrumb-text-hover)] font-medium">Home</span>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <span className="text-[var(--color-text-subtle)]">Current</span>
                      <span className="text-[var(--breadcrumb-text-current)] font-medium">web-large</span>
                    </div>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Status indicator Component */}
            <Section id="status-indicator" title="Status indicator" description="Server/instance status indicators with predefined states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 6×4px</code> · <code>gap: 4px</code> · <code>radius: pill (16px)</code> · <code>font-size: 11px</code> · <code>icon: 14px</code>
                  </div>
                </VStack>

                {/* All status Types by Category */}
                <VStack gap={3}>
                  <Label>Active</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Tooltip content="active"><StatusIndicator status="active" /></Tooltip>
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Error</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Tooltip content="error"><StatusIndicator status="error" /></Tooltip>
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Action</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Tooltip content="building"><StatusIndicator status="building" /></Tooltip>
                    <Tooltip content="deleting"><StatusIndicator status="deleting" /></Tooltip>
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Warning (Orange)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Tooltip content="verify-resized"><StatusIndicator status="verify-resized" /></Tooltip>
                    <Tooltip content="degraded"><StatusIndicator status="degraded" /></Tooltip>
                    <Tooltip content="no-monitor"><StatusIndicator status="no-monitor" /></Tooltip>
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Muted (Gray)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Tooltip content="suspended"><StatusIndicator status="suspended" /></Tooltip>
                    <Tooltip content="shelved-offloaded"><StatusIndicator status="shelved-offloaded" /></Tooltip>
                    <Tooltip content="mounted"><StatusIndicator status="mounted" /></Tooltip>
                    <Tooltip content="shutoff"><StatusIndicator status="shutoff" /></Tooltip>
                    <Tooltip content="paused"><StatusIndicator status="paused" /></Tooltip>
                    <Tooltip content="pending"><StatusIndicator status="pending" /></Tooltip>
                    <Tooltip content="draft"><StatusIndicator status="draft" /></Tooltip>
                    <Tooltip content="deactivated"><StatusIndicator status="deactivated" /></Tooltip>
                    <Tooltip content="in-use"><StatusIndicator status="in-use" /></Tooltip>
                    <Tooltip content="maintenance"><StatusIndicator status="maintenance" /></Tooltip>
                    <Tooltip content="down"><StatusIndicator status="down" /></Tooltip>
                  </div>
                </VStack>

                {/* Layout Variants - Icon Only (All Cases) */}
                <VStack gap={3}>
                  <Label>Icon Only - All status Types</Label>
                  <VStack gap={4}>
                    {/* Active */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Active</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Tooltip content="active"><StatusIndicator status="active" layout="icon-only" /></Tooltip>
                      </div>
                    </VStack>
                    {/* Error */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Error</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Tooltip content="error"><StatusIndicator status="error" layout="icon-only" /></Tooltip>
                      </div>
                    </VStack>
                    {/* Action */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Action</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Tooltip content="building"><StatusIndicator status="building" layout="icon-only" /></Tooltip>
                        <Tooltip content="deleting"><StatusIndicator status="deleting" layout="icon-only" /></Tooltip>
                      </div>
                    </VStack>
                    {/* Warning */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Warning</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Tooltip content="verify-resized"><StatusIndicator status="verify-resized" layout="icon-only" /></Tooltip>
                        <Tooltip content="degraded"><StatusIndicator status="degraded" layout="icon-only" /></Tooltip>
                        <Tooltip content="no-monitor"><StatusIndicator status="no-monitor" layout="icon-only" /></Tooltip>
                      </div>
                    </VStack>
                    {/* Muted */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Muted</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Tooltip content="suspended"><StatusIndicator status="suspended" layout="icon-only" /></Tooltip>
                        <Tooltip content="shelved-offloaded"><StatusIndicator status="shelved-offloaded" layout="icon-only" /></Tooltip>
                        <Tooltip content="mounted"><StatusIndicator status="mounted" layout="icon-only" /></Tooltip>
                        <Tooltip content="shutoff"><StatusIndicator status="shutoff" layout="icon-only" /></Tooltip>
                        <Tooltip content="paused"><StatusIndicator status="paused" layout="icon-only" /></Tooltip>
                        <Tooltip content="pending"><StatusIndicator status="pending" layout="icon-only" /></Tooltip>
                        <Tooltip content="draft"><StatusIndicator status="draft" layout="icon-only" /></Tooltip>
                        <Tooltip content="deactivated"><StatusIndicator status="deactivated" layout="icon-only" /></Tooltip>
                        <Tooltip content="in-use"><StatusIndicator status="in-use" layout="icon-only" /></Tooltip>
                        <Tooltip content="maintenance"><StatusIndicator status="maintenance" layout="icon-only" /></Tooltip>
                        <Tooltip content="down"><StatusIndicator status="down" layout="icon-only" /></Tooltip>
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
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 8×4px</code> · <code>radius: 4px</code> · <code>font-size: 11px</code> · <code>min-width: 60px</code> · <code>max-width: 230px</code> · <code>arrow: 4px</code>
                  </div>
                </VStack>

                {/* Positions */}
                <VStack gap={3}>
                  <Label>Positions</Label>
                  <div className="flex gap-6 items-center justify-center py-8">
                    <Tooltip content="Top tooltip" position="top">
                      <Button variant="secondary" size="sm">Top</Button>
                    </Tooltip>
                    <Tooltip content="Bottom tooltip" position="bottom">
                      <Button variant="secondary" size="sm">Bottom</Button>
                    </Tooltip>
                    <Tooltip content="Left tooltip" position="left">
                      <Button variant="secondary" size="sm">Left</Button>
                    </Tooltip>
                    <Tooltip content="Right tooltip" position="right">
                      <Button variant="secondary" size="sm">Right</Button>
                    </Tooltip>
                  </div>
                </VStack>

                {/* Examples */}
                <VStack gap={3}>
                  <Label>Use cases</Label>
                  <div className="flex gap-4 items-center">
                    <Tooltip content="Delete this item permanently">
                      <Button variant="danger" icon={<IconTrash size={16} />} aria-label="Delete" />
                    </Tooltip>
                    <Tooltip content="Add to favorites">
                      <Button variant="ghost" icon={<IconStar size={16} />} aria-label="Favorite" />
                    </Tooltip>
                    <Tooltip content="Copy to clipboard">
                      <Button variant="secondary" icon={<IconCopy size={16} />} aria-label="Copy" />
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
                      <Button variant="outline" size="sm">0ms</Button>
                    </Tooltip>
                    <Tooltip content="Default (200ms)" delay={200}>
                      <Button variant="outline" size="sm">200ms</Button>
                    </Tooltip>
                    <Tooltip content="Slow (500ms)" delay={500}>
                      <Button variant="outline" size="sm">500ms</Button>
                    </Tooltip>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* WindowControl Component */}
            <Section id="window-control" title="Window control" description="Window control buttons for minimize, maximize, and close actions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 24×24px</code> · <code>icon: 12px</code> · <code>radius: 4px</code> · <code>gap: 4px</code>
                  </div>
                </VStack>

                {/* Individual Controls */}
                <VStack gap={3}>
                  <Label>Individual controls</Label>
                  <div className="flex gap-6 items-center">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Minimize</span>
                      <WindowControl type="minimize" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Maximize</span>
                      <WindowControl type="maximize" />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Close</span>
                      <WindowControl type="close" />
                    </VStack>
                  </div>
                </VStack>

                {/* Controls Group */}
                <VStack gap={3}>
                  <Label>Controls group</Label>
                  <div className="flex gap-6 items-center">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">All Controls</span>
                      <WindowControls />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Minimize + Close</span>
                      <WindowControls showMaximize={false} />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Close Only</span>
                      <WindowControls showMinimize={false} showMaximize={false} />
                    </VStack>
                  </div>
                </VStack>

                {/* In Context */}
                <VStack gap={3}>
                  <Label>In Context (Header Bar)</Label>
                  <div className="flex items-center justify-between w-full max-w-[400px] h-10 px-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <span className="text-[length:var(--font-size-12)] font-medium">Application Title</span>
                    <WindowControls />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Scrollbar */}
            <Section id="scrollbar" title="Scrollbar" description="Custom scrollbar styles for various containers">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>width: 6px</code> · <code>radius: full</code> · <code>track: transparent</code> · <code>thumb: border-default</code>
                  </div>
                </VStack>

                {/* Available Classes */}
                <VStack gap={3}>
                  <Label>Available classes</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">sidebar-scroll</div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                        Main sidebar navigation. Width: 6px, stable gutter.
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">drawer-scroll</div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                        Drawer/Panel content. Width: 6px.
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">settings-scroll</div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                        Settings page content. Width: 6px.
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">legend-scroll</div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                        Chart legend area. Width: 6px.
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">shell-scroll</div>
                      <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
                        Terminal/Shell output. Width: 6px, dark thumb (#475569).
                      </div>
                    </div>
                    <div className="p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                      <div className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)] mb-2">table-scroll-container</div>
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">sidebar-scroll (6px)</span>
                      <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden sidebar-scroll bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                        <div className="space-y-2 w-full">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="text-[length:var(--font-size-11)] text-[var(--color-text-default)] py-1">
                              Menu Item {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-[200px]">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">shell-scroll (dark)</span>
                      <div className="w-full h-[150px] overflow-y-auto overflow-x-hidden shell-scroll bg-[#1e293b] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-3">
                        <div className="space-y-1 font-mono w-full">
                          {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="text-[length:var(--font-size-11)] text-[#94a3b8]">
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Table horizontal scrollbar (height: 6px)</span>
                      <div className="w-full max-w-[500px] table-scroll-container bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]" style={{ overflowX: 'auto' }}>
                        <div className="flex gap-4 p-3" style={{ width: '800px' }}>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-[120px] h-[60px] bg-[var(--color-surface-muted)] rounded-[var(--radius-md)] flex items-center justify-center text-[length:var(--font-size-11)] text-[var(--color-text-default)]">
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
            <Section id="detail-header" title="Detail header" description="Page header component for resource detail views with title, actions, and info cards">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code> · <code>container.gap: 12px</code> · <code>title: 16px semibold</code> · <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> · <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code> · <code>info-card.gap: 6px</code>
                  </div>
                </VStack>

                {/* Full Example - Figma Reference */}
                <VStack gap={3}>
                  <Label>Instance Detail header (Figma Reference)</Label>
                  <DetailHeader>
                    <DetailHeader.Title>tk-test</DetailHeader.Title>
                    <DetailHeader.Actions>
                      <Button variant="outline" size="sm" leftIcon={<IconTerminal2 size={12} stroke={1.5} />}>Console</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}>Start</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconPlayerStop size={12} stroke={1.5} />}>Stop</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconRefresh size={12} stroke={1.5} />}>Reboot</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>Delete</Button>
                      <Button variant="outline" size="sm" rightIcon={<IconChevronDown size={12} stroke={1.5} />}>More actions</Button>
                    </DetailHeader.Actions>
                    <DetailHeader.InfoGrid>
                      <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                      <DetailHeader.InfoCard label="ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
                      <DetailHeader.InfoCard label="Host" value="compute-03" />
                      <DetailHeader.InfoCard label="Created at" value="2025-07-25 09:12:20" />
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
                    <DetailHeader.InfoCard label="Instance ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
                    <DetailHeader.InfoCard label="IP Address" value="192.168.1.100" copyable />
                  </div>
                </VStack>

                {/* Info Card Basic */}
                <VStack gap={3}>
                  <Label>Info Card - Basic Text</Label>
                  <div className="grid grid-cols-3 gap-2">
                      <DetailHeader.InfoCard label="Host" value="compute-03" />
                      <DetailHeader.InfoCard label="Created at" value="2025-07-25 09:12:20" />
                    <DetailHeader.InfoCard label="Availability zone" value="nova" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* SectionCard Component */}
            <Section id="section-card" title="Section card" description="Container component for grouping related content in detail views">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> · <code>header.height: 32px</code> · <code>title: 14px medium</code> · <code>label: 11px medium</code> · <code>value: 12px</code>
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
                      actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
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
                      <SectionCard.DataRow label="Flavor name" value="m1.large" isLink linkHref="/flavors" />
                      <SectionCard.DataRow label="Spec" value="vCPU: 4 / RAM: 8 GiB / Disk: 80 GiB" />
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
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
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
                        <SectionCard.DataRow label="Flavor name" value="web-server-10" isLink linkHref="/flavors" />
                        <SectionCard.DataRow label="Spec" value="vCPU: 1 / RAM: 4 GiB / Disk: 40 GiB / GPU: 1" />
                      </SectionCard.Content>
                    </SectionCard>

                    <SectionCard>
                      <SectionCard.Header title="Image" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Image" value="web-server-10" isLink linkHref="/images" />
                      </SectionCard.Content>
                    </SectionCard>
                  </VStack>
                </VStack>
              </VStack>
            </Section>

            {/* Wizard (Create Flow) Component */}
            <Section id="wizard" title="Wizard (Create Flow)" description="Multi-step wizard pattern for resource creation with section status management">
              <WizardPatternSection />
            </Section>

            {/* Menu Component */}
            <Section id="menu" title="Menu" description="Navigation menu with sections, items, and dividers">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>item.padding: 8×6px</code> · <code>item.gap: 6px</code> · <code>item.radius: 6px (md)</code> · <code>section.padding: 8×4px</code> · <code>divider.margin: 8px</code>
                  </div>
                </VStack>

                {/* Example */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VStack gap={3}>
                    <Label>Menu items</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuItem icon={<IconHome size={16} stroke={1.5} />} label="Home" />
                      <MenuItem icon={<IconServer size={16} stroke={1.5} />} label="Instances" active />
                      <MenuItem icon={<IconSettings size={16} stroke={1.5} />} label="Settings" />
                      <MenuDivider />
                      <MenuItem icon={<IconUser size={16} stroke={1.5} />} label="Profile" />
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Collapsible section</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuSection title="Storage">
                        <MenuItem label="Volumes" />
                        <MenuItem label="Snapshots" />
                        <MenuItem label="Backups" />
                      </MenuSection>
                      <MenuSection title="Network">
                        <MenuItem label="Security groups" />
                        <MenuItem label="Floating IPs" />
                      </MenuSection>
                    </div>
                  </VStack>
                </div>
              </VStack>
            </Section>

            {/* ContextMenu Component */}
            <Section id="context-menu" title="Context menu" description="Popup menu triggered by right-click or click with submenu support">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>min-width: 80px</code> · <code>padding: 12×6px</code> · <code>radius: 6px</code> · <code>shadow: md</code>
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
                    <Button variant="outline" size="sm">Click for Menu</Button>
                  </ContextMenu>
                </VStack>

                {/* With Submenu */}
                <VStack gap={3}>
                  <Label>With submenu</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'new', label: 'New', submenu: [
                        { id: 'new-file', label: 'File', onClick: () => {} },
                        { id: 'new-folder', label: 'Folder', onClick: () => {} },
                      ]},
                      { id: 'open', label: 'Open', onClick: () => {} },
                      { id: 'save', label: 'Save', onClick: () => {}, divider: true },
                      { id: 'export', label: 'Export', submenu: [
                        { id: 'export-pdf', label: 'PDF', onClick: () => {} },
                        { id: 'export-csv', label: 'CSV', onClick: () => {} },
                        { id: 'export-json', label: 'JSON', onClick: () => {} },
                      ]},
                    ]}
                  >
                    <Button variant="outline" size="sm">Menu with Submenu</Button>
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
                      { id: 'danger1', label: 'Warning action', status: 'danger', onClick: () => {} },
                      { id: 'danger2', label: 'Delete forever', status: 'danger', onClick: () => {} },
                    ]}
                  >
                    <Button variant="outline" size="sm">Show status variants</Button>
                  </ContextMenu>
                </VStack>
              </VStack>
            </Section>

            {/* Modal Component */}
            <Section id="modal" title="Modal" description="Dialog overlay for confirmations, alerts, and user interactions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16px</code> · <code>gap: 24px</code> · <code>radius: 16px</code> · <code>backdrop: black/60</code>
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
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">Info Box (single value)</span>
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
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">Scrollable List (max-h: 96px)</span>
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
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">Warning Alert</span>
                      <div className="bg-[var(--color-state-danger-bg)] rounded-[var(--radius-md)] p-3 flex gap-2 items-start">
                        <IconAlertCircle size={16} className="text-[var(--color-state-danger)] shrink-0 mt-0.5" stroke={1.5} />
                        <p className="text-[11px] text-[var(--color-text-default)] leading-4">
                          This action will permanently delete the resource. This cannot be undone.
                        </p>
                      </div>
                    </div>

                    {/* Button Group */}
                    <div className="p-4 border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                      <span className="text-[11px] font-medium text-[var(--color-text-subtle)] mb-2 block">Button Group</span>
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
                    삭제 확인 등 반복적인 패턴을 위한 전용 컴포넌트. <code>infoLabel</code>, <code>infoValue</code>, <code>confirmVariant</code> props 지원.
                  </p>
                  <ModalDemo variant="delete" />
                </VStack>

              </VStack>
            </Section>

            {/* Drawer Component */}
            <Section id="drawer" title="Drawer" description="Slide-out panel for forms, details, and secondary content">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>width: 376px (default)</code> · <code>padding-x: 24px</code> · <code>padding-y: 16px</code> · <code>animation: 300ms ease-out</code>
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
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Property</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Default</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">isOpen</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether the drawer is open</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onClose</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Callback when drawer should close</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">title</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Drawer title</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">width</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">string | number</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">320</td>
                          <td className="py-2 text-[var(--color-text-default)]">Width of the drawer</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">side</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'left' | 'right'</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'right'</td>
                          <td className="py-2 text-[var(--color-text-default)]">Side from which drawer appears</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">footer</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">ReactNode</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Footer content (typically action buttons)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">showCloseButton</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether to show close button</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">closeOnBackdropClick</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Whether clicking backdrop closes drawer</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Monitoring toolbar */}
            <Section id="monitoring-toolbar" title="Monitoring toolbar" description="Time range selection and refresh controls for monitoring dashboards">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>segment-padding: 4px 12px</code> · <code>border-radius: 8px</code> · <code>font-size: 11px</code> · <code>gap: 4px</code>
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
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Property</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                          <th className="text-left py-2 pr-4 font-medium text-[var(--color-text-subtle)]">Default</th>
                          <th className="text-left py-2 font-medium text-[var(--color-text-subtle)]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">timeRangeOptions</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeOption[]</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">30m, 1h, 6h, 12h, 24h</td>
                          <td className="py-2 text-[var(--color-text-default)]">Time range options to display</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">timeRange</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeValue</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Controlled time range value</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">defaultTimeRange</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">TimeRangeValue</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'30m'</td>
                          <td className="py-2 text-[var(--color-text-default)]">Default time range (uncontrolled)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onTimeRangeChange</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">(value) =&gt; void</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Callback when time range changes</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">customPeriod</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">CustomPeriod | null</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Custom date range (start, end)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onCustomPeriodChange</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">(period) =&gt; void</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Callback when custom period changes</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">onRefresh</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">() =&gt; void</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">-</td>
                          <td className="py-2 text-[var(--color-text-default)]">Callback when refresh is clicked</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">showRefresh</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Show refresh button</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">maxDate</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">Date</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">new Date()</td>
                          <td className="py-2 text-[var(--color-text-default)]">Maximum selectable date</td>
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
            <Section id="floating-card" title="Floating card" description="Floating summary card for create/edit flows with sections, quota, and actions">
              <VStack gap={8}>
                {/* Basic Example - QuotaSidebar Style */}
                <VStack gap={4}>
                  <Label>Basic Example (QuotaSidebar from Create Instance)</Label>
                  <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg">
                    {/* QuotaSidebar Container */}
                    <div className="w-[312px] shrink-0">
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
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Launch type</span>
                                <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                  <IconCheck size={10} stroke={2.5} className="text-white" />
                                </div>
                              </div>
                              {/* Basic information - done */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Basic information</span>
                                <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                  <IconCheck size={10} stroke={2.5} className="text-white" />
                                </div>
                              </div>
                              {/* Source - done */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Source</span>
                                <div className="w-4 h-4 shrink-0 rounded-full bg-[var(--color-state-success)] flex items-center justify-center">
                                  <IconCheck size={10} stroke={2.5} className="text-white" />
                                </div>
                              </div>
                              {/* Flavor - active */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Flavor</span>
                                <div className="w-4 h-4 shrink-0">
                                  <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
                                </div>
                              </div>
                              {/* Network - pre */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Network</span>
                                <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
                              </div>
                              {/* Authentication - pre */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Authentication</span>
                                <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
                              </div>
                              {/* Advanced - pre */}
                              <div className="flex items-center justify-between py-1">
                                <span className="text-[12px] leading-5 text-[var(--color-text-default)]">Advanced</span>
                                <div className="w-4 h-4 shrink-0 rounded-full border border-[var(--color-border-default)]" />
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
                              <ProgressBar variant="quota" label="Instance" value={3} max={10} newValue={1} showValue />
                              <ProgressBar variant="quota" label="vCPU" value={7} max={20} newValue={2} showValue />
                              <ProgressBar variant="quota" label="RAM (GiB)" value={18} max={50} newValue={4} showValue />
                              <ProgressBar variant="quota" label="Disk" value={3} max={10} newValue={1} showValue />
                              <ProgressBar variant="quota" label="Disk capacity (GiB)" value={70} max={1000} newValue={50} showValue />
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
                          <Button variant="secondary" onClick={() => console.log('Cancel')} className="w-[80px]">
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
                      <div className="size-4 rounded-full border border-[var(--color-border-default)]" style={{ borderStyle: 'dashed' }} />
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">Default</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 shrink-0">
                        <IconProgress size={16} stroke={1.5} className="text-[var(--color-text-subtle)] animate-spin" />
                      </div>
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full border border-[var(--color-state-danger)] bg-[var(--color-state-danger)] flex items-center justify-center">
                        <IconAlertTriangle size={10} stroke={2} className="text-white" />
                      </div>
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full border border-[var(--color-state-success)] bg-[var(--color-state-success)] flex items-center justify-center">
                        <IconCheck size={10} stroke={2} className="text-white" />
                      </div>
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">Success</span>
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
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Prop</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Type</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Default</th>
                          <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">title</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">string</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">required</td>
                          <td className="py-2 text-[var(--color-text-default)]">Card title in summary section</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">sections</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">FloatingCardSection[]</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                          <td className="py-2 text-[var(--color-text-default)]">Collapsible sections with items</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">quota</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">QuotaItem[]</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">[]</td>
                          <td className="py-2 text-[var(--color-text-default)]">Quota progress bars</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">position</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">FloatingCardPosition</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">'top-left'</td>
                          <td className="py-2 text-[var(--color-text-default)]">Position when portal is true</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">portal</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">true</td>
                          <td className="py-2 text-[var(--color-text-default)]">Render in portal (fixed position)</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">actionEnabled</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">boolean</td>
                          <td className="py-2 pr-4 text-[var(--color-text-muted)]">false</td>
                          <td className="py-2 text-[var(--color-text-default)]">Enable primary action button</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-mono text-[var(--color-action-primary)]">width</td>
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
            <Section id="layout" title="Layout" description="Application layout structure with responsive sidebar">
              <VStack gap={8}>
                {/* Layout Specs */}
                <VStack gap={4}>
                  <Label>Layout specifications</Label>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[length:var(--font-size-12)]">
                      <thead>
                        <tr className="border-b border-[var(--color-border-default)]">
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Breakpoint</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Width</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Sidebar</th>
                          <th className="text-left py-3 pr-4 font-medium text-[var(--color-text-subtle)]">Content Area</th>
                          <th className="text-left py-3 font-medium text-[var(--color-text-subtle)]">Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">Desktop (Default)</td>
                          <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1920px</td>
                          <td className="py-3 pr-4 text-[var(--color-text-default)]">200px (collapsible)</td>
                          <td className="py-3 pr-4 text-[var(--color-text-muted)]">1720px max</td>
                          <td className="py-3 text-[var(--color-text-muted)]">Sidebar toggle</td>
                        </tr>
                        <tr className="border-b border-[var(--color-border-subtle)]">
                          <td className="py-3 pr-4 font-mono text-[var(--color-text-default)]">Laptop (Min)</td>
                          <td className="py-3 pr-4 font-mono text-[var(--color-action-primary)]">1440px</td>
                          <td className="py-3 pr-4 text-[var(--color-text-default)]">200px (collapsible)</td>
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
                        <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-action-primary)]">200px</span>
                      </div>
                      <div className="flex-1 py-2 text-center">
                        <span className="text-[length:var(--font-size-10)] font-mono text-[var(--color-text-muted)]">Content Area (1720px max)</span>
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
                        <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-action-primary)]">200px</span>
                      </div>
                      <div className="flex-1 py-1.5 text-center">
                        <span className="text-[length:var(--font-size-9)] font-mono text-[var(--color-text-muted)]">Content (1240px max)</span>
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
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">Sidebar Expanded</span>
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
                        <span className="text-[length:var(--font-size-11)] text-[var(--color-text-default)]">Sidebar Collapsed</span>
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

            {/* Bar chart */}
            <Section id="bar-chart" title="Bar chart" description="Visual indicator for quota usage and progress with status-based colors">
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
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
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
                    <ProgressBar
                      variant="quota"
                      label="Instance"
                      value={10}
                      newValue={0}
                    />
                  </div>
                </VStack>

                {/* Default Variant - Simple Progress */}
                <VStack gap={3}>
                  <Label>Default Variant - Simple Progress</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <ProgressBar
                      label="60 MB (75%)"
                      value={75}
                      max={100}
                      showValue={false}
                    />
                  </div>
                </VStack>

                {/* Error State */}
                <VStack gap={3}>
                  <Label>Error state</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <ProgressBar
                      label="60 MB (75%)"
                      value={75}
                      max={100}
                      showValue={false}
                      error
                      errorMessage="Upload failed: Network error"
                    />
                  </div>
                </VStack>

                {/* Color Legend */}
                <VStack gap={3}>
                  <Label>Status colors</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-success-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">0% ~ 70%: Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-warning-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">70% ~ 100%: Warning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-state-error-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">&gt;100%: Danger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-[var(--color-border-default)]" />
                      <span className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Unlimited: Neutral</span>
                    </div>
                  </div>
                </VStack>

                {/* Dashboard Only */}
                <VStack gap={3}>
                  <Label>Dashboard only</Label>
                  <div className="w-[288px] p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-2xl">
                    <div className="text-[11px] font-semibold text-[var(--color-text-muted)] tracking-wide mb-4">COMPUTE QUOTA</div>
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
            <Section id="area-chart" title="Area chart" description="Filled area visualization for volume and cumulative data">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>fill-opacity: 0.1</code> · <code>line-width: 1px</code> · <code>smooth: true</code> · <code>symbol-size: 6px</code>
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
            <Section id="pie-chart" title="Pie chart" description="Part-to-whole relationships with percentage labels on slices">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>radius: 90px</code> · <code>label-threshold: 15%</code> · <code>legend: external</code> · <code>legend-scroll: 60px</code>
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
            <Section id="half-doughnut-chart" title="Half-Doughnut chart" description="Progress and metric visualization with half-circular arc design">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>arc-width: 14px</code> · <code>start-angle: 200°</code> · <code>end-angle: -20°</code> · <code>status-colors: success/warning/error</code>
                  </div>
                </VStack>

                {/* Status Variants */}
                <VStack gap={3}>
                  <Label>Status variants</Label>
                  <div className="flex items-center gap-8 flex-wrap">
                    <HalfDoughnutChartDemo value={35} label="Safe" status="success" used={66.5} total={189.9} unit="TiB" />
                    <HalfDoughnutChartDemo value={75} label="Warning" status="warning" used={142.4} total={189.9} unit="TiB" />
                    <HalfDoughnutChartDemo value={95} label="Danger" status="error" used={180.4} total={189.9} unit="TiB" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Doughnut chart */}
            <Section id="doughnut-chart" title="Doughnut chart" description="Ring chart for part-to-whole relationships with optional center metrics">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>inner-radius: 68%</code> · <code>outer-radius: 80%</code> · <code>thickness: 12%</code> · <code>border-radius: 6px</code>
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

/* ----------------------------------------
   Helper Components
   ---------------------------------------- */

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <VStack id={id} gap={6} align="stretch" className="p-6 bg-[var(--color-surface-default)] rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)] scroll-mt-6">
      <VStack gap={1} align="start">
        <h2 className="text-[length:var(--font-size-18)] font-semibold text-[var(--color-text-default)]">{title}</h2>
        <p className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">{description}</p>
      </VStack>
      {children}
    </VStack>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[length:var(--font-size-11)] font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">{children}</span>;
}

function ColorSwatch({ name, color, textLight = false }: { name: string; color: string; textLight?: boolean }) {
  const [hexValue, setHexValue] = useState('');
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const computed = getComputedStyle(ref.current).backgroundColor;
      // Convert rgb(r, g, b) to hex
      const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const hex = '#' + [match[1], match[2], match[3]].map(x => {
          const h = parseInt(x).toString(16);
          return h.length === 1 ? '0' + h : h;
        }).join('').toUpperCase();
        setHexValue(hex);
      }
    }
  }, [color]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip content={`${color}\n${hexValue}`} position="top">
    <div 
        ref={ref}
        className="w-full h-12 rounded-[var(--radius-md)] flex flex-col items-center justify-center border border-[var(--color-border-subtle)] cursor-pointer hover:ring-2 hover:ring-[var(--color-border-focus)] transition-shadow" 
      style={{ backgroundColor: color }}
        onClick={handleCopy}
    >
        <span className={`text-[10px] font-mono font-medium ${textLight ? 'text-white' : 'text-black'}`}>{name}</span>
        <span className={`text-[8px] font-mono ${textLight ? 'text-white/70' : 'text-black/50'}`}>
          {copied ? 'Copied!' : hexValue}
        </span>
    </div>
    </Tooltip>
  );
}

function SemanticColorBox({ name, color, border = false }: { name: string; color: string; border?: boolean }) {
  const [hexValue, setHexValue] = useState('');
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const computed = getComputedStyle(ref.current).backgroundColor;
      const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const hex = '#' + [match[1], match[2], match[3]].map(x => {
          const h = parseInt(x).toString(16);
          return h.length === 1 ? '0' + h : h;
        }).join('').toUpperCase();
        setHexValue(hex);
      }
    }
  }, [color]);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Tooltip content={`${color}\n${hexValue}`} position="top">
    <VStack gap={1} align="center">
        <div 
          ref={ref}
          className={`w-10 h-10 rounded-[var(--radius-md)] cursor-pointer hover:ring-2 hover:ring-[var(--color-border-focus)] transition-shadow ${border ? 'border border-[var(--color-border-default)]' : ''}`} 
          style={{ backgroundColor: color }}
          onClick={handleCopy}
        />
        <span className="text-[8px] font-mono text-[var(--color-text-disabled)] truncate max-w-10">
          {copied ? '✓' : name}
        </span>
    </VStack>
    </Tooltip>
  );
}

function SpacingSwatch({ name, value }: { name: string; value: string }) {
  const numericValue = parseInt(value);
  return (
    <VStack gap={1} align="center">
      <div className="bg-[var(--color-action-primary)] rounded-sm min-w-1" style={{ width: Math.max(numericValue, 4), height: 20 }} />
      <span className="text-[9px] font-mono text-[var(--color-text-disabled)]">{name}</span>
      <span className="text-[8px] font-mono text-[var(--color-text-disabled)]">{value}</span>
    </VStack>
  );
}

function TokenCard({ title, description, items, color, textColor }: { title: string; description: string; items: string[]; color: string; textColor: string }) {
  return (
    <VStack gap={3} className="p-4 rounded-[var(--radius-lg)]" style={{ backgroundColor: color }}>
      <VStack gap={1}>
        <span className="text-[length:var(--font-size-14)] font-semibold" style={{ color: textColor }}>{title}</span>
        <span className="text-[length:var(--font-size-11)]" style={{ color: textColor, opacity: 0.8 }}>{description}</span>
      </VStack>
      <ul className="text-[length:var(--font-size-10)] space-y-1" style={{ color: textColor, opacity: 0.9 }}>
        {items.map((item, i) => <li key={i}>• {item}</li>)}
      </ul>
    </VStack>
  );
}

function IconDisplayGrid({ title, icons, searchQuery = '' }: { title: string; icons: { Icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>; name: string; missing?: boolean }[]; searchQuery?: string }) {
  const filteredIcons = searchQuery
    ? icons.filter(({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()))
    : icons;

  // Don't render the group if no icons match the search
  if (searchQuery && filteredIcons.length === 0) {
    return null;
  }

  return (
    <VStack gap={3}>
      <Label>{title}</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {filteredIcons.map(({ Icon, name, missing }, i) => (
          <div
            key={i}
            title={missing ? `⚠️ ${name} (needs custom icon)` : name}
            className={`flex flex-col items-center gap-2 p-3 rounded-[var(--radius-md)] border transition-colors cursor-default group ${
              missing
                ? 'bg-[var(--color-state-warning-bg)] border-[var(--color-state-warning)] border-dashed hover:bg-[var(--color-yellow-100)]'
                : 'bg-[var(--color-surface-subtle)] border-[var(--color-border-subtle)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-surface-default)]'
            }`}
          >
            <Icon size={18} stroke={1.5} className={`shrink-0 transition-colors ${missing ? 'text-[var(--color-state-warning)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-default)]'}`} />
            <span className={`text-[length:var(--font-size-10)] transition-colors truncate w-full text-center ${missing ? 'text-[var(--color-state-warning-text)]' : 'text-[var(--color-text-disabled)] group-hover:text-[var(--color-text-subtle)]'}`}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </VStack>
  );
}
