import { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
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
  Chip,
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
  SNBMenuItem,
  CardTitle,
} from '@/design-system';
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
  IconArchive,
  IconTemplate,
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
  IconFileText,
  IconCode,
  // Brand Icons
  IconBrandUbuntu,
  IconBrandDebian,
  IconBrandWindows,
  IconBrandRedhat,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';

/* ----------------------------------------
   Navigation Items
   ---------------------------------------- */

// Foundation items (기초 토큰/스타일)
const foundationItems = [
  { id: 'token-architecture', label: 'Token Architecture', icon: IconLayoutGrid },
  { id: 'primitive-colors', label: 'Primitive Colors', icon: IconPalette },
  { id: 'semantic-colors', label: 'Semantic Colors', icon: IconPalette },
  { id: 'typography', label: 'Typography', icon: IconTypography },
  { id: 'spacing-radius', label: 'Spacing & Radius', icon: IconBoxMultiple },
  { id: 'borders', label: 'Borders', icon: IconBorderAll },
  { id: 'shadows', label: 'Shadows', icon: IconBoxMultiple },
  { id: 'icons', label: 'Icons', icon: IconStar },
];

// Component items (UI 컴포넌트)
// Form Controls - matches actual content order
const formControlItems = [
  { id: 'button', label: 'Button', icon: IconClick },
  { id: 'input', label: 'Input', icon: IconForms },
  { id: 'select', label: 'Select', icon: IconSelector },
  { id: 'datepicker', label: 'DatePicker', icon: IconCalendar },
  { id: 'slider', label: 'Slider', icon: IconAdjustments },
  { id: 'chip', label: 'Chip', icon: IconTag },
  { id: 'pagination', label: 'Pagination', icon: IconProgress },
  { id: 'progress-bar', label: 'Progress Bar', icon: IconProgress },
  { id: 'loading', label: 'Loading', icon: IconLoader2 },
  { id: 'snb-menu-item', label: 'SNBMenuItem', icon: IconLayoutNavbar },
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
  { id: 'inline-message', label: 'Inline Message', icon: IconInfoCircle },
  { id: 'table', label: 'Table', icon: IconList },
  { id: 'badge', label: 'Badge', icon: IconTag },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: IconChevronRight },
  { id: 'status-indicator', label: 'Status Indicator', icon: IconActivity },
  { id: 'card-title', label: 'Card Title', icon: IconLayoutGrid },
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2 },
  { id: 'window-control', label: 'Window Control', icon: IconAppWindow },
];

// Patterns - matches actual content order
const patternItems = [
  { id: 'detail-header', label: 'Detail Header', icon: IconLayoutNavbar },
  { id: 'section-card', label: 'Section Card', icon: IconLayoutGrid },
  { id: 'menu', label: 'Menu', icon: IconMenu2 },
  { id: 'context-menu', label: 'Context Menu', icon: IconMenu2 },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid },
  { id: 'monitoring-toolbar', label: 'Monitoring Toolbar', icon: IconRefresh },
  { id: 'notification-center', label: 'Notification Center', icon: IconBell },
  { id: 'floating-card', label: 'Floating Card', icon: IconLayoutGrid },
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar },
];

// Graphs
const graphItems = [
  { id: 'bar-chart', label: 'Bar Chart', icon: IconChartBar },
  { id: 'area-chart', label: 'Area Chart', icon: IconChartBar },
  { id: 'pie-chart', label: 'Pie Chart', icon: IconActivity },
  { id: 'half-doughnut-chart', label: 'Half-Doughnut Chart', icon: IconGauge },
  { id: 'doughnut-chart', label: 'Doughnut Chart', icon: IconChartDonut },
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
   Filter Search Input Demo
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
        placeholder="Find Instance with filters"
        className="w-[400px]"
      />
      <div className="text-[11px] text-[var(--color-text-subtle)] bg-[var(--color-surface-muted)] p-3 rounded-md">
        <strong>Usage:</strong> Click the input to see available filters. Select a filter type, then enter a value (text) or choose from options (select).
        Applied filters appear as removable tags below the input.
      </div>
    </div>
  );
}

/* ----------------------------------------
   Notification Center Section
   ---------------------------------------- */

function NotificationCenterSection() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
  ]);

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <Section
      id="notification-center"
      title="Notification Center"
      description="Centralized notification panel with filtering, read/unread states, and real-time updates"
    >
      <VStack gap={8}>
        {/* Design Tokens */}
        <VStack gap={3}>
          <Label>Design Tokens</Label>
          <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
            <code>width: 360px</code> · <code>padding: 16px</code> · <code>border-radius: 8px</code> · <code>shadow: lg</code>
          </div>
        </VStack>

        {/* Live Demo */}
        <VStack gap={3}>
          <Label>Live Demo</Label>
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
          <Label>Notification Types</Label>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-success)] bg-opacity-20 flex items-center justify-center">
                  <IconCheck size={12} className="text-[var(--color-state-success)]" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Success</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Operation completed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-danger)] bg-opacity-20 flex items-center justify-center">
                  <IconX size={12} className="text-[var(--color-state-danger)]" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Error</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Operation failed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-warning)] bg-opacity-20 flex items-center justify-center">
                  <IconAlertTriangle size={12} className="text-[var(--color-state-warning)]" />
                </div>
                <span className="text-[length:var(--font-size-12)] font-medium text-[var(--color-text-default)]">Warning</span>
              </div>
              <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">Attention needed</p>
            </div>
            <div className="p-3 bg-[var(--color-surface-default)] rounded-[var(--radius-md)] border border-[var(--color-border-default)]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--color-state-info)] bg-opacity-20 flex items-center justify-center">
                  <IconInfoCircle size={12} className="text-[var(--color-state-info)]" />
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
          <Label>Design Tokens</Label>
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
   Modal Demo (with state)
   ---------------------------------------- */

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
            <Label>Example Content</Label>
            <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
              You can put any content inside a drawer, including forms, lists, or details.
            </p>
          </VStack>
        </VStack>
      </Drawer>

      {/* Drawer with Footer */}
      <Button variant="outline" size="sm" onClick={() => setIsFormOpen(true)}>
        With Footer
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

      {/* Attach Volume Drawer */}
      <Button variant="outline" size="sm" onClick={() => setIsAttachVolumeOpen(true)}>
        Attach Volume
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
   Bar Chart Demo (ECharts - from storage-dashboard)
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
      <ReactECharts option={getOption()} style={{ height: variant === 'horizontal' ? '250px' : '200px' }} notMerge={true} />
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
   Area Chart Demo (ECharts - from storage-dashboard)
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
          <ReactECharts option={option} style={{ height: '100%', width: '100%' }} notMerge={true} />
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
  const remaining = total - used;
  
  const getColors = () => {
    if (percentage >= 100) return {
      bg: 'bg-[var(--color-status-error)]/15',
      text: 'text-[var(--color-status-error)]',
      bar: 'bg-[var(--color-text-default)]'
    };
    if (percentage >= 70) return {
      bg: 'bg-[var(--color-status-warning)]/15',
      text: 'text-[var(--color-status-warning)]',
      bar: 'bg-[var(--color-text-default)]'
    };
    return {
      bg: 'bg-[var(--color-status-success)]/15',
      text: 'text-[var(--color-status-success)]',
      bar: 'bg-[var(--color-text-default)]'
    };
  };
  
  const colors = getColors();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[var(--color-text-default)]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-[var(--color-text-muted)]">{used}/{total} {unit}</span>
          <div className={`flex items-center px-1.5 py-0.5 rounded-md ${colors.bg}`}>
            <span className={`text-[11px] font-medium ${colors.text}`}>{percentage}%</span>
          </div>
        </div>
      </div>
      <Tooltip 
        content={`Used: ${used} ${unit}\nRemaining: ${remaining} ${unit}\nTotal: ${total} ${unit}`}
        position="top"
      >
        <div className="w-full">
          <div className="h-1 rounded-sm bg-[var(--color-surface-muted)] overflow-hidden cursor-pointer">
            <div 
              className={`h-full rounded-sm ${colors.bar} transition-all`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

function AreaChartDemo({ variant }: { variant: 'basic' | 'stacked' }) {
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
   Pie Chart Demo (ECharts - from storage-dashboard)
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
        fontSize: 11
      },
      formatter: (params: { marker: string; name: string; value: number; percent: number }) => {
        return `${params.marker} ${params.name}<br/><span style="font-weight: 600; margin-left: 14px;">${params.value} (${params.percent.toFixed(0)}%)</span>`;
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
          color: '#ffffff'
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
        <ReactECharts option={getOption()} style={{ height: '180px', width: '180px' }} />
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
   Half-Doughnut Chart Demo (ECharts - from storage-dashboard)
   ---------------------------------------- */

function HalfDoughnutChartDemo({ value, label, status = 'default' }: { value: number; label: string; status?: 'default' | 'success' | 'warning' | 'error' }) {
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
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4 relative">
      <ReactECharts option={getOption()} style={{ height: '160px', width: '180px' }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-[24px] leading-[28px] font-semibold text-[var(--color-text-default)]">{value}%</span>
        <span className="text-[12px] text-[var(--color-text-subtle)]">{label}</span>
      </div>
    </div>
  );
}

/* ----------------------------------------
   Single Value Doughnut Chart Demo (ECharts)
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
        top: '46%',
        style: {
          text: `${value}%`,
          textAlign: 'center',
          fill: getColor('--color-text-default', '#0f172a'),
          fontSize: 18,
          fontWeight: 600
        }
      }
    ]
  });

  return (
    <div className="bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-4">
      <h4 className="text-[13px] font-medium text-[var(--color-text-default)] mb-2">{title}</h4>
      <ReactECharts option={getOption()} style={{ height: '180px', width: '200px' }} />
    </div>
  );
}

/* ----------------------------------------
   TabBar Demo (with state)
   ---------------------------------------- */

function TabBarDemo() {
  const { tabs, activeTab, addTab, closeTab, selectTab } = useTabBar({
    initialTabs: [
      { id: 'tab-1', label: 'Entry page', closable: true },
      { id: 'tab-2', label: 'Settings', closable: true },
      { id: 'tab-3', label: 'Profile', closable: true },
    ],
    initialActiveTab: 'tab-1',
  });

  let tabCounter = 4;

  const handleAddTab = () => {
    addTab({
      id: `tab-${tabCounter}`,
      label: `New Tab ${tabCounter}`,
      closable: true,
    });
    tabCounter++;
  };

  return (
    <VStack gap={8}>
      {/* Tokens */}
      <VStack gap={3}>
        <Label>Design Tokens</Label>
        <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
          <code>height: 36px</code> · <code>tab-width: 100-200px</code> · <code>padding-x: 12px</code> · <code>font: 12px</code>
        </div>
      </VStack>

      {/* Interactive Demo */}
      <VStack gap={3}>
        <Label>Interactive Demo</Label>
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

      {/* With Icons */}
      <VStack gap={3}>
        <Label>With Icons</Label>
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

      {/* Many Tabs (Scroll) */}
      <VStack gap={3}>
        <Label>Many Tabs (with scroll navigation)</Label>
        <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
          <TabBar
            tabs={[
              { id: 'tab-1', label: 'Entry page', closable: true },
              { id: 'tab-2', label: 'Analytics', closable: true },
              { id: 'tab-3', label: 'Reports', closable: true },
              { id: 'tab-4', label: 'Users', closable: true },
              { id: 'tab-5', label: 'Settings', closable: true },
              { id: 'tab-6', label: 'Notifications', closable: true },
              { id: 'tab-7', label: 'Integrations', closable: true },
              { id: 'tab-8', label: 'Security', closable: true },
              { id: 'tab-9', label: 'Billing', closable: true },
              { id: 'tab-10', label: 'Support', closable: true },
            ]}
            activeTab="tab-1"
            onTabChange={() => {}}
            onTabClose={() => {}}
            showAddButton={false}
          />
        </div>
        <p className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)]">
          When tabs overflow, use arrow buttons to scroll left/right
        </p>
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

// Sample Key Pair data for copy demo
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
      width: '70px',
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
      width: '180px',
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
      width: '70px',
      align: 'center' as const,
      render: (value: boolean) => value ? (
        <IconLock size={16} stroke={1.5} className="text-[var(--color-text-default)]" />
      ) : null
    },
    { key: 'fixedIp', label: 'Fixed IP', sortable: true, width: '120px' },
    { 
      key: 'image', 
      label: 'Image', 
      sortable: true, 
      width: '150px',
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
      width: '130px',
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
      width: '80px',
      render: () => (
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]">
            <IconTerminal2 size={16} stroke={1.5} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-[var(--color-surface-muted)] transition-colors text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]">
            <IconDotsVertical size={16} stroke={1.5} />
          </button>
        </div>
      )
    },
  ];

  // Columns with Attached To (external link + resource icon)
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
      label: 'Attached To', 
      flex: 1,
      render: (_: string | null, row: InstanceData) => (
        row.attachedTo && row.attachedToId ? (
          <div className="flex items-center gap-2">
            <Tooltip content={row.attachedType === 'router' ? 'Router' : 'Instance'} position="top" delay={0}>
              <div 
                className="flex-shrink-0 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[4px] p-1 cursor-pointer hover:bg-[var(--color-surface-muted)] transition-colors"
              >
                {row.attachedType === 'router' ? (
                  <IconRouter size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                ) : (
                  <IconCube size={12} stroke={1.5} className="text-[var(--color-text-subtle)]" />
                )}
              </div>
            </Tooltip>
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
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">-</span>
        )
      )
    },
  ];

  // Columns with copy functionality (Key Pairs style)
  const copyColumns = [
    { 
      key: 'name', 
      label: 'Name', 
      width: '180px',
      render: (value: string) => (
        <span className="text-[var(--color-action-primary)] cursor-pointer hover:underline hover:underline-offset-2">{value}</span>
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
            className="p-1.5 -m-1 rounded-md hover:bg-[var(--color-surface-muted)] active:bg-[var(--color-surface-subtle)] transition-colors flex-shrink-0"
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
    { key: 'createdAt', label: 'Created At', width: '140px' },
  ];

  // Compact columns for horizontal scroll demo
  const compactColumns = [
    { 
      key: 'status', 
      label: 'Status', 
      width: '60px',
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
    { key: 'status', label: 'Status', width: '59px' },
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
        <Label>Selectable Table</Label>
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
          Attached To column shows resource type icon (Instance/Router), clickable link opens in new window
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

      {/* Empty State */}
      <VStack gap={3}>
        <Label>Empty State</Label>
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
   Design System Page
   ---------------------------------------- */

export function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('token-architecture');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Pagination demo states
  const [demoPage1, setDemoPage1] = useState(1);
  const [demoPage2, setDemoPage2] = useState(5);
  const [demoPage3, setDemoPage3] = useState(15);
  const [demoPage4, setDemoPage4] = useState(2);

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter nav items based on search query
  const filteredNavItems = searchQuery.trim()
    ? navItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredNavItems.length > 0) {
      scrollToSection(filteredNavItems[0].id);
      setSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-subtle)]">
      {/* Left Sidebar Navigation */}
      <nav className="fixed left-0 top-0 w-[200px] h-screen bg-[var(--color-surface-default)] border-r border-[var(--color-border-default)] overflow-y-auto z-50 sidebar-scroll">
        <div className="p-4 overflow-hidden">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-[var(--color-action-primary)] flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">TDS</span>
            </div>
            <span className="text-[length:var(--font-size-14)] font-semibold text-[var(--color-text-default)]">
              Design System
            </span>
          </Link>

          {/* EntryPage Link */}
          <Link
            to="/"
            className="flex items-center gap-2 w-[166px] box-border px-3 py-2 mb-4 rounded-[var(--radius-button)] bg-[var(--color-action-secondary)] hover:bg-[var(--color-action-secondary-hover)] text-[var(--color-text-default)] text-[length:var(--font-size-11)] font-medium transition-colors border border-[var(--color-border-default)]"
          >
            <IconHome size={16} stroke={1.5} className="shrink-0" />
            <span className="truncate flex-1 min-w-0">Entry page</span>
            <IconChevronRight size={14} stroke={1.5} className="shrink-0" />
          </Link>

          {/* Navigation */}
          <VStack gap={4}>
            {/* Foundation Section */}
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Foundation
              </span>
              {foundationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
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
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Form Controls
              </span>
              {formControlItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
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
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Navigation & Data
              </span>
              {navigationItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
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
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Graphs
              </span>
              {graphItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
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
            <VStack gap={1}>
              <span className="px-3 py-1 text-[length:var(--font-size-10)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wider">
                Patterns
              </span>
              {patternItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`
                    w-full px-3 py-2 rounded-[var(--radius-button)] flex items-center gap-2
                    text-[length:var(--font-size-11)] text-left transition-colors
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
                  TDS Design System
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search components, tokens... (Enter to go, Esc to clear)"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[length:var(--font-size-14)] text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-opacity-20 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
                  >
                    <IconX size={16} stroke={1.5} />
                  </button>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 max-h-[300px] overflow-y-auto">
                  {filteredNavItems.length > 0 ? (
                    <div className="p-2">
                      {filteredNavItems.map(({ id, label, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => {
                            scrollToSection(id);
                            setSearchQuery('');
                          }}
                          className="w-full px-3 py-2 rounded-[var(--radius-md)] flex items-center gap-3 text-left hover:bg-[var(--color-surface-muted)] transition-colors"
                        >
                          <Icon size={16} stroke={1.5} className="text-[var(--color-text-muted)]" />
                          <span className="text-[length:var(--font-size-12)] text-[var(--color-text-default)]">{label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Token Architecture Overview */}
            <Section id="token-architecture" title="Token Architecture" description="3-tier design token structure: Primitive → Semantic → Component">
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

            {/* Primitive Colors */}
            <Section id="primitive-colors" title="Primitive Colors" description="Core color palette used as building blocks">
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

            {/* Semantic Colors */}
            <Section id="semantic-colors" title="Semantic Colors" description="Purpose-driven color tokens with light/dark theme support">
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
                  <Label>Border Radius</Label>
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
                  <Label>Border Colors</Label>
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
                  <Label>Border Widths</Label>
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
                  <Label>Border Styles</Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {['solid', 'dashed', 'dotted', 'double', 'none'].map((style) => (
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
                  <Label>Usage Examples</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with default border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border border-[var(--color-border-default)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border-2 border-[var(--color-border-strong)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Card with strong border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border-2 border-[var(--color-border-strong)]</code>
                    </div>
                    <div className="p-4 rounded-[var(--radius-lg)] border-l-4 border-[var(--color-action-primary)] bg-[var(--color-surface-default)]">
                      <p className="text-[length:var(--font-size-12)] text-[var(--color-text-default)] mb-2">Accent left border</p>
                      <code className="text-[length:var(--font-size-10)] text-[var(--color-text-muted)]">border-l-4 border-[var(--color-action-primary)]</code>
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
            <Section id="icons" title="Icons" description="Tabler Icons library - Stroke width 1.5, Size 16-20px">
              <VStack gap={8}>
                {/* Basic - Actions */}
                <IconDisplayGrid
                  title="Actions"
                  icons={[
                    { Icon: IconPlayerPlay, name: 'Play' },
                    { Icon: IconPlayerStop, name: 'Stop' },
                    { Icon: IconPlayerPause, name: 'Pause' },
                    { Icon: IconRefresh, name: 'Refresh' },
                    { Icon: IconRotate, name: 'Reboot' },
                    { Icon: IconTrash, name: 'Delete' },
                    { Icon: IconEdit, name: 'Edit' },
                    { Icon: IconCopy, name: 'Copy' },
                    { Icon: IconShare, name: 'Share' },
                    { Icon: IconDownload, name: 'Download' },
                    { Icon: IconUpload, name: 'Upload' },
                    { Icon: IconPlus, name: 'Add' },
                    { Icon: IconCirclePlus, name: 'Add Circle' },
                    { Icon: IconLink, name: 'Link' },
                    { Icon: IconUnlink, name: 'Unlink' },
                    { Icon: IconExternalLink, name: 'External' },
                    { Icon: IconHistory, name: 'History' },
                    { Icon: IconSend, name: 'Send' },
                  ]}
                />

                {/* Basic - Navigation */}
                <IconDisplayGrid
                  title="Navigation"
                  icons={[
                    { Icon: IconChevronLeft, name: 'Left' },
                    { Icon: IconChevronRight, name: 'Right' },
                    { Icon: IconChevronDown, name: 'Down' },
                    { Icon: IconChevronUp, name: 'Up' },
                    { Icon: IconArrowRight, name: 'Arrow' },
                    { Icon: IconArrowsMaximize, name: 'Expand' },
                    { Icon: IconArrowsMinimize, name: 'Collapse' },
                    { Icon: IconDotsCircleHorizontal, name: 'Action' },
                    { Icon: IconDots, name: 'Meatball' },
                  ]}
                />

                {/* Basic - Status */}
                <IconDisplayGrid
                  title="Status & Feedback"
                  icons={[
                    { Icon: IconCircleCheck, name: 'Success' },
                    { Icon: IconAlertCircle, name: 'Error' },
                    { Icon: IconAlertTriangle, name: 'Warning' },
                    { Icon: IconInfoCircle, name: 'Info' },
                    { Icon: IconBan, name: 'Suspended' },
                    { Icon: IconLoader, name: 'Loading' },
                    { Icon: IconProgress, name: 'Progress' },
                  ]}
                />

                {/* Basic - UI */}
                <IconDisplayGrid
                  title="UI Elements"
                  icons={[
                    { Icon: IconSearch, name: 'Search' },
                    { Icon: IconFilter, name: 'Filter' },
                    { Icon: IconSettings, name: 'Settings' },
                    { Icon: IconHome, name: 'Home' },
                    { Icon: IconBell, name: 'Bell' },
                    { Icon: IconBellRinging, name: 'Bell New' },
                    { Icon: IconStar, name: 'Star' },
                    { Icon: IconStarFilled, name: 'Star Fill' },
                    { Icon: IconHeart, name: 'Heart' },
                    { Icon: IconEye, name: 'Show' },
                    { Icon: IconEyeOff, name: 'Hide' },
                    { Icon: IconLock, name: 'Lock' },
                    { Icon: IconX, name: 'Close' },
                    { Icon: IconCheck, name: 'Check' },
                    { Icon: IconUser, name: 'User' },
                    { Icon: IconMail, name: 'Mail' },
                    { Icon: IconMessage, name: 'Chat' },
                    { Icon: IconHelp, name: 'Help' },
                    { Icon: IconList, name: 'List' },
                    { Icon: IconLayoutGrid, name: 'Grid' },
                  ]}
                />

                {/* System - Infrastructure */}
                <IconDisplayGrid
                  title="Infrastructure"
                  icons={[
                    { Icon: IconServer, name: 'Server' },
                    { Icon: IconServer2, name: 'Instance' },
                    { Icon: IconDatabase, name: 'Storage' },
                    { Icon: IconNetwork, name: 'Network' },
                    { Icon: IconRouter, name: 'Router' },
                    { Icon: IconScale, name: 'LB' },
                    { Icon: IconWorldWww, name: 'Float IP' },
                    { Icon: IconShield, name: 'Security' },
                    { Icon: IconKey, name: 'Key Pair' },
                    { Icon: IconCpu, name: 'Flavor' },
                    { Icon: IconPlug, name: 'Port' },
                    { Icon: IconCloud, name: 'Cloud' },
                  ]}
                />

                {/* System - Storage & Files */}
                <IconDisplayGrid
                  title="Storage & Files"
                  icons={[
                    { Icon: IconDeviceFloppy, name: 'Backup' },
                    { Icon: IconCamera, name: 'Snapshot' },
                    { Icon: IconPhoto, name: 'Image' },
                    { Icon: IconFile, name: 'File' },
                    { Icon: IconArchive, name: 'Archive' },
                    { Icon: IconTemplate, name: 'Template' },
                    { Icon: IconStack2, name: 'Layers' },
                  ]}
                />

                {/* System - Monitoring */}
                <IconDisplayGrid
                  title="Monitoring & Analytics"
                  icons={[
                    { Icon: IconTerminal, name: 'Console' },
                    { Icon: IconTerminal2, name: 'Terminal' },
                    { Icon: IconActivity, name: 'Activity' },
                    { Icon: IconChartBar, name: 'Chart' },
                    { Icon: IconGauge, name: 'Speed' },
                    { Icon: IconDeviceDesktop, name: 'Desktop' },
                    { Icon: IconDeviceDesktopAnalytics, name: 'Analytics' },
                    { Icon: IconLayoutDashboard, name: 'Entry page' },
                  ]}
                />

                {/* System - Organization */}
                <IconDisplayGrid
                  title="Organization"
                  icons={[
                    { Icon: IconTopologyRing, name: 'Topology' },
                    { Icon: IconTopologyStar3, name: 'Star Topo' },
                    { Icon: IconCertificate, name: 'Cert' },
                    { Icon: IconBuilding, name: 'Building' },
                    { Icon: IconCategory, name: 'Category' },
                    { Icon: IconUserCircle, name: 'User' },
                    { Icon: IconLayoutSidebar, name: 'Sidebar' },
                    { Icon: IconAdjustments, name: 'Adjust' },
                    { Icon: IconBolt, name: 'Action' },
                    { Icon: IconGitBranch, name: 'Branch' },
                    { Icon: IconClock, name: 'Schedule' },
                    { Icon: IconHourglass, name: 'Timeout' },
                    { Icon: IconCurrencyDollar, name: 'Billing' },
                    { Icon: IconLanguage, name: 'Language' },
                  ]}
                />

                {/* AI & Advanced */}
                <IconDisplayGrid
                  title="AI & Advanced"
                  icons={[
                    { Icon: IconBrain, name: 'Brain' },
                    { Icon: IconRobot, name: 'Robot' },
                    { Icon: IconMessageChatbot, name: 'Chatbot' },
                    { Icon: IconBooks, name: 'Study' },
                    { Icon: IconTestPipe, name: 'Test' },
                  ]}
                />

                {/* OS / Brand Icons */}
                <IconDisplayGrid
                  title="OS / Brand"
                  icons={[
                    { Icon: IconBrandUbuntu, name: 'Ubuntu' },
                    { Icon: IconBrandDebian, name: 'Debian' },
                    { Icon: IconBrandWindows, name: 'Windows' },
                    { Icon: IconBrandRedhat, name: 'RedHat' },
                    { Icon: IconHelp, name: 'Rocky Linux', missing: true },
                  ]}
                />
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
                  <Label>Design Tokens</Label>
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
                          { name: 'height', sm: '28px', md: '32px', lg: '40px' },
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
                    <Button size="sm" variant="warning">Warning</Button>
                    <Button size="sm" variant="link">Link</Button>
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With Icons</Label>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" leftIcon={<IconPlus size={14} />}>Left Icon</Button>
                    <Button size="sm" rightIcon={<IconArrowRight size={14} />}>Right Icon</Button>
                    <Button size="sm" icon={<IconHeart size={14} />} aria-label="Like" />
                    <Button size="sm" variant="secondary" icon={<IconStar size={14} />} aria-label="Star" />
                  </div>
                  <div className="mt-4"><Label>Icon + Text (Action Buttons)</Label></div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" variant="secondary" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconPlayerPlay size={12} />}>Start</Button>
                    <Button size="sm" variant="secondary" leftIcon={<IconPlus size={12} />}>Create</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconPlus size={12} />}>Create</Button>
                    <Button size="sm" variant="secondary" leftIcon={<IconEdit size={12} />}>Edit</Button>
                    <Button size="sm" variant="muted" leftIcon={<IconEdit size={12} />}>Edit</Button>
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
                    <Button size="sm" as="a" href="#" target="_blank">As Anchor</Button>
                    <Button size="sm" as={Link} to="/">As Router Link</Button>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Input Component */}
            <Section id="input" title="Input" description="Text fields, textarea, number input, and search">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                    <Input label="With Helper" placeholder="Email" helperText="We'll never share your email" className="w-[200px]" />
                    <Input label="With Error" placeholder="Username" error="Username is required" className="w-[200px]" />
                  </div>
                </VStack>

                {/* With Icons */}
                <VStack gap={3}>
                  <Label>With Icons</Label>
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
                  <Label>Search Input</Label>
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

                {/* FilterSearchInput */}
                <VStack gap={3}>
                  <Label>Filter Search Input</Label>
                  <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                    Search input with filter dropdown. Click to select filter field, then enter value or select option.
                  </p>
                  <FilterSearchInputDemo />
                </VStack>
              </VStack>
            </Section>

            {/* Select Component */}
            <Section id="select" title="Select" description="Dropdown select for choosing from a list of options">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Size Variants</Label>
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
                    label="Instance Type"
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

                {/* Clearable Select */}
                <VStack gap={3}>
                  <Label>Clearable Select</Label>
                  <p className="text-[length:var(--font-size-11)] text-[var(--color-text-muted)]">
                    Select with clear button (✕) and "Clear" option in dropdown. Useful for filter dropdowns.
                  </p>
                  <div className="flex gap-4 items-start">
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">All Statuses</span>
                      <Select
                        placeholder="All Statuses"
                        defaultValue="all"
                        clearable
                        options={[
                          { value: 'all', label: 'All Statuses' },
                          { value: 'running', label: 'Running' },
                          { value: 'pending', label: 'Pending' },
                          { value: 'failed', label: 'Failed' },
                        ]}
                        className="w-[180px]"
                      />
                    </VStack>
                    <VStack gap={1}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">All Resources</span>
                      <Select
                        placeholder="All Resources"
                        defaultValue="all"
                        clearable
                        options={[
                          { value: 'all', label: 'All Resources' },
                          { value: 'gpu', label: 'GPU Usage' },
                          { value: 'cpu', label: 'CPU Only' },
                        ]}
                        className="w-[180px]"
                      />
                    </VStack>
                  </div>
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
                  <Label>Design Tokens</Label>
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
                <VStack gap={3}>
                  <Label>With Value Display</Label>
                  <div className="w-[312px]">
                    <Slider defaultValue={50} showValue />
                  </div>
                </VStack>

                {/* Custom Range */}
                <VStack gap={3}>
                  <Label>Custom Range (0-1000 GB)</Label>
                  <div className="w-[312px]">
                    <Slider 
                      min={0} 
                      max={1000} 
                      step={50} 
                      defaultValue={250} 
                      showValue 
                      formatValue={(v) => `${v} GB`}
                    />
                  </div>
                </VStack>

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
              </VStack>
            </Section>

            {/* Chip Component */}
            <Section id="chip" title="Chip" description="Interactive tags for displaying selected values with optional remove action">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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

            {/* Pagination Component */}
            <Section id="pagination" title="Pagination" description="Navigation for paginated content">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Many Pages</Label>
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

            {/* ProgressBar Component */}
            <Section id="progress-bar" title="Progress Bar" description="Visual indicator for quota usage and progress with status-based colors">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                      statusText="chunking"
                      showValue={false}
                    />
                  </div>
                </VStack>

                {/* Error State */}
                <VStack gap={3}>
                  <Label>Error State</Label>
                  <div className="w-[280px] flex flex-col gap-4 p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <ProgressBar
                      label="60 MB (75%)"
                      value={75}
                      max={100}
                      statusText="error"
                      showValue={false}
                      error
                      errorMessage="Upload failed: Network error"
                    />
                  </div>
                </VStack>

                {/* Color Legend */}
                <VStack gap={3}>
                  <Label>Status Colors</Label>
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
              </VStack>
            </Section>

            {/* Loading Component */}
            <Section id="loading" title="Loading" description="Loading indicators for various states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>spinner: 16/22/32px</code> · <code>progress: h-1</code> · <code>button: min-w-80px</code>
                  </div>
                </VStack>

                {/* Spinner Variant */}
                <VStack gap={3}>
                  <Label>Spinner Variant</Label>
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
                  <Label>Progress Variant</Label>
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

            {/* SNBMenuItem Component */}
            <Section id="snb-menu-item" title="SNBMenuItem" description="Side Navigation Bar Menu Item with default, hover, and selected states">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 38×38px</code> · <code>padding: 8px 6px</code> · <code>radius: 8px</code> · <code>icon: 22px</code>
                  </div>
                </VStack>

                {/* Status Variants */}
                <VStack gap={3}>
                  <Label>Status Variants</Label>
                  <div className="flex gap-8 items-center p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Default</span>
                      <SNBMenuItem status="default">
                        <IconBoxMultiple size={22} stroke={1} />
                      </SNBMenuItem>
                    </VStack>
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Hover</span>
                      <SNBMenuItem status="hover">
                        <IconBoxMultiple size={22} stroke={1} />
                      </SNBMenuItem>
                    </VStack>
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Selected</span>
                      <SNBMenuItem status="selected">
                        <IconBoxMultiple size={22} stroke={1} />
                      </SNBMenuItem>
                    </VStack>
                  </div>
                </VStack>

                {/* Type Variants */}
                <VStack gap={3}>
                  <Label>Type Variants</Label>
                  <div className="flex gap-8 items-center p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon (Default)</span>
                      <SNBMenuItem isSelected>
                        <IconBoxMultiple size={22} stroke={1} />
                      </SNBMenuItem>
                    </VStack>
                    <VStack gap={2} align="center">
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Icon (Selected)</span>
                      <SNBMenuItem type="text" text="P" status="selected" />
                    </VStack>
                  </div>
                </VStack>

                {/* Interactive Demo */}
                <VStack gap={3}>
                  <Label>Interactive Demo (Hover to see effect)</Label>
                  <div className="flex gap-2 p-4 bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--radius-lg)]">
                    <SNBMenuItem>
                      <IconHome size={22} stroke={1} />
                    </SNBMenuItem>
                    <SNBMenuItem isSelected>
                      <IconBoxMultiple size={22} stroke={1} />
                    </SNBMenuItem>
                    <SNBMenuItem>
                      <IconDatabase size={22} stroke={1} />
                    </SNBMenuItem>
                    <SNBMenuItem>
                      <IconSettings size={22} stroke={1} />
                    </SNBMenuItem>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Toggle Component */}
            <Section id="toggle" title="Toggle" description="On/Off switch control for binary settings">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Interactive Examples</Label>
                  <div className="flex flex-col gap-3">
                    <Toggle label="Enable dark mode" defaultChecked />
                    <Toggle label="Receive notifications" />
                    <Toggle label="Auto-backup enabled" defaultChecked />
                  </div>
                </VStack>

                {/* With Description */}
                <VStack gap={3}>
                  <Label>With Description</Label>
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
                  <Label>Design Tokens</Label>
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
                  <Label>Error State</Label>
                  <div className="flex gap-8 items-start">
                    <Checkbox label="Unchecked with error" error errorMessage="This field is required" />
                    <Checkbox label="Checked with error" defaultChecked error />
                  </div>
                </VStack>

                {/* With Description */}
                <VStack gap={3}>
                  <Label>With Description</Label>
                  <Checkbox
                    label="Email notifications"
                    description="Receive email notifications for important updates"
                    defaultChecked
                  />
                </VStack>

                {/* Checkbox Group */}
                <VStack gap={3}>
                  <Label>Checkbox Group</Label>
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
                  <Label>Design Tokens</Label>
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
                  <Label>Radio Group</Label>
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
                  <Label>Design Tokens</Label>
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
                      actions={
                        <>
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications"
                            onClick={() => console.log('Notifications')}
                          />
                          <TopBarAction
                            icon={<IconUser size={16} stroke={1.5} />}
                            aria-label="Profile"
                            onClick={() => console.log('Profile')}
                          />
                        </>
                      }
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
                            { label: 'My Project' },
                          ]}
                        />
                      }
                      actions={
                        <>
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications"
                            badge
                          />
                          <TopBarAction
                            icon={<IconBell size={16} stroke={1.5} />}
                            aria-label="Notifications with count"
                            badgeCount={5}
                          />
                          <TopBarAction
                            icon={<IconSettings size={16} stroke={1.5} />}
                            aria-label="Settings"
                          />
                        </>
                      }
                    />
                  </div>
                </VStack>

                {/* Minimal */}
                <VStack gap={3}>
                  <Label>Minimal (No Navigation)</Label>
                  <div className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-md)] overflow-hidden">
                    <TopBar
                      showNavigation={false}
                      breadcrumb={
                        <Breadcrumb
                          items={[
                            { label: 'Settings' },
                          ]}
                        />
                      }
                      actions={
                        <TopBarAction
                          icon={<IconHelp size={16} stroke={1.5} />}
                          aria-label="Help"
                        />
                      }
                    />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* TabBar Component */}
            <Section id="tabbar" title="TabBar" description="Browser-style tabs with add/close functionality">
              <TabBarDemo />
            </Section>

            {/* Tabs Component */}
            <Section id="tabs" title="Tabs" description="Tabs for navigation between views with underline and boxed variants">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Boxed</span>
                      <Tabs defaultValue="left" variant="boxed" size="sm">
                        <TabList>
                          <Tab value="left">left</Tab>
                          <Tab value="right">right</Tab>
                        </TabList>
                      </Tabs>
                    </VStack>
                  </VStack>
                </VStack>

                {/* Boxed - Multiple Items */}
                <VStack gap={3}>
                  <Label>Boxed - Multiple Items</Label>
                  <VStack gap={4}>
                    <Tabs defaultValue="tab1" variant="boxed" size="sm">
                      <TabList>
                        <Tab value="tab1">Tab 1</Tab>
                        <Tab value="tab2">Tab 2</Tab>
                        <Tab value="tab3">Tab 3</Tab>
                      </TabList>
                    </Tabs>
                    <Tabs defaultValue="tab1" variant="boxed" size="sm">
                      <TabList>
                        <Tab value="tab1">Tab 1</Tab>
                        <Tab value="tab2">Tab 2</Tab>
                        <Tab value="tab3">Tab 3</Tab>
                        <Tab value="tab4">Tab 4</Tab>
                      </TabList>
                    </Tabs>
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
                  <Label>Interactive Example</Label>
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
                  <Label>Design Tokens</Label>
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
                  <Label>With Content</Label>
                  <div className="border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-4">
                    <Disclosure defaultOpen>
                      <Disclosure.Trigger>Volume Details</Disclosure.Trigger>
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
                  <Label>Multiple Disclosures</Label>
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
            <Section id="inline-message" title="Inline Message" description="Contextual feedback messages for different states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Without Icon</Label>
                  <InlineMessage variant="info" hideIcon>
                    This message has no icon.
                  </InlineMessage>
                </VStack>

                {/* Long Content */}
                <VStack gap={3}>
                  <Label>Long Content</Label>
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
                  <Label>Design Tokens</Label>
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
                    <Badge size="sm" theme="blue">Text Only</Badge>
                    <Badge size="sm" theme="blue" leftIcon={<IconCheck size={10} />}>Left Icon</Badge>
                    <Badge size="sm" theme="blue" rightIcon={<IconArrowRight size={10} />}>Right Icon</Badge>
                  </div>
                </VStack>

                {/* With Dot */}
                <VStack gap={3}>
                  <Label>With Dot Indicator</Label>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" theme="green" dot>Running</Badge>
                    <Badge size="sm" theme="red" dot>Stopped</Badge>
                    <Badge size="sm" theme="yellow" dot>Pending</Badge>
                    <Badge size="sm" theme="gray" dot>Unknown</Badge>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Badge size="sm" type="subtle" theme="green" dot>Running</Badge>
                    <Badge size="sm" type="subtle" theme="red" dot>Stopped</Badge>
                    <Badge size="sm" type="subtle" theme="yellow" dot>Pending</Badge>
                    <Badge size="sm" type="subtle" theme="gray" dot>Unknown</Badge>
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Breadcrumb Component */}
            <Section id="breadcrumb" title="Breadcrumb" description="Navigation path indicator with clickable links">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>gap: 4px</code> · <code>font-size: 11px</code> · <code>line-height: 16px</code> · <code>font-weight: medium</code>
                  </div>
                </VStack>

                {/* Basic Usage */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
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
                  <Label>Long Path</Label>
                  <div className="p-4 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-md)]">
                    <Breadcrumb
                      items={[
                        { label: 'Home', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
                        { label: 'Instance Snapshots', onClick: () => {} },
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

            {/* Status Indicator Component */}
            <Section id="status-indicator" title="Status Indicator" description="Server/instance status indicators with predefined states">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 6×4px</code> · <code>gap: 4px</code> · <code>radius: pill (16px)</code> · <code>font-size: 11px</code> · <code>icon: 14px</code>
                  </div>
                </VStack>

                {/* All Status Types by Category */}
                <VStack gap={3}>
                  <Label>Success (Green)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="active" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Danger (Red)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="error" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Info (Blue)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="building" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Warning (Orange)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="verify-resized" />
                    <StatusIndicator status="degraded" />
                    <StatusIndicator status="no-monitor" />
                  </div>
                </VStack>

                <VStack gap={3}>
                  <Label>Muted (Gray)</Label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <StatusIndicator status="suspended" />
                    <StatusIndicator status="shelved-offloaded" />
                    <StatusIndicator status="mounted" />
                    <StatusIndicator status="shutoff" />
                    <StatusIndicator status="paused" />
                    <StatusIndicator status="pending" />
                    <StatusIndicator status="draft" />
                    <StatusIndicator status="deactivated" />
                    <StatusIndicator status="in-use" />
                    <StatusIndicator status="maintenance" />
                    <StatusIndicator status="down" />
                  </div>
                </VStack>

                {/* Layout Variants - Icon Only (All Cases) */}
                <VStack gap={3}>
                  <Label>Icon Only - All Status Types</Label>
                  <VStack gap={4}>
                    {/* Success */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Success (Green)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="active" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Danger */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Danger (Red)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="error" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Info */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Info (Blue)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="building" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Warning */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Warning (Orange)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="verify-resized" layout="icon-only" />
                        <StatusIndicator status="degraded" layout="icon-only" />
                        <StatusIndicator status="no-monitor" layout="icon-only" />
                      </div>
                    </VStack>
                    {/* Muted */}
                    <VStack gap={2}>
                      <span className="text-[length:var(--font-size-10)] text-[var(--color-text-subtle)]">Muted (Gray)</span>
                      <div className="flex flex-wrap gap-2 items-center">
                        <StatusIndicator status="suspended" layout="icon-only" />
                        <StatusIndicator status="shelved-offloaded" layout="icon-only" />
                        <StatusIndicator status="mounted" layout="icon-only" />
                        <StatusIndicator status="shutoff" layout="icon-only" />
                        <StatusIndicator status="paused" layout="icon-only" />
                        <StatusIndicator status="pending" layout="icon-only" />
                        <StatusIndicator status="draft" layout="icon-only" />
                        <StatusIndicator status="deactivated" layout="icon-only" />
                        <StatusIndicator status="in-use" layout="icon-only" />
                        <StatusIndicator status="maintenance" layout="icon-only" />
                        <StatusIndicator status="down" layout="icon-only" />
                      </div>
                    </VStack>
                  </VStack>
                </VStack>

                {/* Custom Labels */}
                <VStack gap={3}>
                  <Label>Custom Labels</Label>
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

            {/* CardTitle Component */}
            <Section id="card-title" title="Card Title" description="Flexible card header with status, description, badges, and side content">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>title: 16px semibold</code> · <code>description: 12px</code> · <code>gap: 12px</code> · <code>status-dot: 24px</code> · <code>badge: 11px medium</code>
                  </div>
                </VStack>

                {/* Basic Usage */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle title="lively-sunset-6041" />
                    <CardTitle 
                      title="lively-sunset-6041" 
                      description="PyTorch GPU-enabled template for AI/ML workloads" 
                    />
                  </div>
                </VStack>

                {/* With Status Indicator */}
                <VStack gap={3}>
                  <Label>With Status Indicator</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle 
                      title="lively-sunset-6041" 
                      description="Running instance with GPU support"
                      showStatus
                      statusColor="success"
                    />
                    <CardTitle 
                      title="failed-instance-1234" 
                      description="Instance failed to start"
                      showStatus
                      statusColor="error"
                    />
                    <CardTitle 
                      title="building-instance-5678" 
                      description="Instance is being provisioned"
                      showStatus
                      statusColor="info"
                    />
                  </div>
                </VStack>

                {/* With Badges */}
                <VStack gap={3}>
                  <Label>With Badges</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle 
                      title="lively-sunset-6041" 
                      description="PyTorch GPU-enabled template for AI/ML workloads"
                      showStatus
                      statusColor="success"
                      badges={[
                        { label: 'Public', variant: 'success' },
                        { label: 'ai-ml', variant: 'info' },
                        { label: 'PyTorch', variant: 'muted' },
                        { label: 'GPU', variant: 'muted' },
                      ]}
                    />
                  </div>
                </VStack>

                {/* With Side Content - Gauge */}
                <VStack gap={3}>
                  <Label>With Gauge Side Content</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle 
                      title="lively-sunset-6041" 
                      description="CPU utilization monitoring"
                      showStatus
                      statusColor="success"
                      side="gauge"
                      gaugeValue="78.5%"
                      gaugeLabel="Utilization"
                    />
                    <CardTitle 
                      title="idle-server-9999" 
                      side="gauge"
                      gaugeValue="0.0%"
                      gaugeLabel="Utilization"
                    />
                  </div>
                </VStack>

                {/* With Side Content - Icon */}
                <VStack gap={3}>
                  <Label>With Icon Side Content</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle 
                      title="lively-sunset-6041" 
                      description="PyTorch GPU-enabled template"
                      showStatus
                      statusColor="success"
                      side="icon"
                      sideIcon={<IconServer size={22} stroke={1.5} className="text-[var(--color-text-muted)]" />}
                    />
                  </div>
                </VStack>

                {/* All Props Combined */}
                <VStack gap={3}>
                  <Label>Full Example</Label>
                  <div className="flex flex-col gap-4 p-4 bg-[var(--color-surface-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
                    <CardTitle 
                      title="production-ml-server" 
                      description="High-performance ML inference server with NVIDIA A100 GPU"
                      showStatus
                      statusColor="success"
                      badges={[
                        { label: 'Production', variant: 'success' },
                        { label: 'ml-inference', variant: 'info' },
                        { label: 'A100', variant: 'warning' },
                      ]}
                      side="gauge"
                      gaugeValue="92.3%"
                      gaugeLabel="GPU Load"
                    />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Tooltip Component */}
            <Section id="tooltip" title="Tooltip" description="Contextual information on hover">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Use Cases</Label>
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
                  <Label>Custom Delay</Label>
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
            <Section id="window-control" title="Window Control" description="Window control buttons for minimize, maximize, and close actions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>size: 16×16px</code> · <code>radius: 4px</code> · <code>gap: 4px</code>
                  </div>
                </VStack>

                {/* Individual Controls */}
                <VStack gap={3}>
                  <Label>Individual Controls</Label>
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
                  <Label>Controls Group</Label>
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

            {/* DetailHeader Component */}
            <Section id="detail-header" title="Detail Header" description="Page header component for resource detail views with title, actions, and info cards">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>container.padding: 16×12px</code> · <code>container.radius: 8px</code> · <code>container.gap: 12px</code> · <code>title: 16px semibold</code> · <code>actions.gap: 4px</code> · <code>info-grid.gap: 8px</code> · <code>info-card.padding: 16×12px</code> · <code>info-card.radius: 8px</code> · <code>info-card.gap: 6px</code>
                  </div>
                </VStack>

                {/* Full Example - Figma Reference */}
                <VStack gap={3}>
                  <Label>Instance Detail Header (Figma Reference)</Label>
                  <DetailHeader>
                    <DetailHeader.Title>tk-test</DetailHeader.Title>
                    <DetailHeader.Actions>
                      <Button variant="outline" size="sm" leftIcon={<IconTerminal2 size={12} stroke={1.5} />}>Console</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconPlayerPlay size={12} stroke={1.5} />}>Start</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconPlayerStop size={12} stroke={1.5} />}>Stop</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconRefresh size={12} stroke={1.5} />}>Reboot</Button>
                      <Button variant="outline" size="sm" leftIcon={<IconTrash size={12} stroke={1.5} />}>Delete</Button>
                      <Button variant="outline" size="sm" rightIcon={<IconChevronDown size={12} stroke={1.5} />}>More Actions</Button>
                    </DetailHeader.Actions>
                    <DetailHeader.InfoGrid>
                      <DetailHeader.InfoCard label="Status" value="Active" status="active" />
                      <DetailHeader.InfoCard label="ID" value="7284d9174e81431e93060a9bbcf2cdfd" copyable />
                      <DetailHeader.InfoCard label="Host" value="compute-03" />
                      <DetailHeader.InfoCard label="Created At" value="2025-07-25 09:12:20" />
                    </DetailHeader.InfoGrid>
                  </DetailHeader>
                </VStack>

                {/* Info Card Status States */}
                <VStack gap={3}>
                  <Label>Info Card - Status Indicator States</Label>
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
                      <DetailHeader.InfoCard label="Created At" value="2025-07-25 09:12:20" />
                    <DetailHeader.InfoCard label="Availability Zone" value="nova" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* SectionCard Component */}
            <Section id="section-card" title="Section Card" description="Container component for grouping related content in detail views">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16×12px</code> · <code>radius: 6px (md)</code> · <code>header.height: 32px</code> · <code>title: 14px medium</code> · <code>label: 11px medium</code> · <code>value: 12px</code>
                  </div>
                </VStack>

                {/* Basic Example */}
                <VStack gap={3}>
                  <Label>Basic Usage</Label>
                  <SectionCard>
                    <SectionCard.Header title="Basic Information" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Instance Name" value="web-server-01" />
                      <SectionCard.DataRow label="Availability Zone" value="nova" />
                      <SectionCard.DataRow label="Description" value="Production web server" />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* With Actions */}
                <VStack gap={3}>
                  <Label>With Action Buttons</Label>
                  <SectionCard>
                    <SectionCard.Header 
                      title="Basic Information" 
                      actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
                    />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Instance Name" value="web-server-01" />
                      <SectionCard.DataRow label="Availability Zone" value="nova" />
                    </SectionCard.Content>
                  </SectionCard>
                </VStack>

                {/* With Links */}
                <VStack gap={3}>
                  <Label>With Link Values</Label>
                  <SectionCard>
                    <SectionCard.Header title="Flavor" />
                    <SectionCard.Content>
                      <SectionCard.DataRow label="Flavor Name" value="m1.large" isLink linkHref="/flavors" />
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
                        title="Basic Information" 
                        actions={<Button variant="secondary" size="sm" leftIcon={<IconEdit size={12} />}>Edit</Button>}
                      />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Instance Name" value="tk-test" />
                        <SectionCard.DataRow label="Availability Zone" value="nova" />
                        <SectionCard.DataRow label="Description" value="-" />
                      </SectionCard.Content>
                    </SectionCard>

                    <SectionCard>
                      <SectionCard.Header title="Flavor" />
                      <SectionCard.Content>
                        <SectionCard.DataRow label="Flavor Name" value="web-server-10" isLink linkHref="/flavors" />
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

            {/* Menu Component */}
            <Section id="menu" title="Menu" description="Navigation menu with sections, items, and dividers">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>item.padding: 8×6px</code> · <code>item.gap: 6px</code> · <code>item.radius: 6px (md)</code> · <code>section.padding: 8×4px</code> · <code>divider.margin: 8px</code>
                  </div>
                </VStack>

                {/* Example */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <VStack gap={3}>
                    <Label>Menu Items</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuItem icon={<IconHome size={16} />} label="Home" />
                      <MenuItem icon={<IconServer size={16} />} label="Instances" active badge="6" />
                      <MenuItem icon={<IconSettings size={16} />} label="Settings" />
                      <MenuDivider />
                      <MenuItem icon={<IconUser size={16} />} label="Profile" />
                    </div>
                  </VStack>

                  <VStack gap={3}>
                    <Label>Collapsible Section</Label>
                    <div className="w-full max-w-[200px] p-2 bg-[var(--color-surface-default)] rounded-[var(--radius-card)] border border-[var(--color-border-default)]">
                      <MenuSection title="Storage">
                        <MenuItem label="Volumes" />
                        <MenuItem label="Snapshots" />
                        <MenuItem label="Backups" />
                      </MenuSection>
                      <MenuSection title="Network">
                        <MenuItem label="Security Groups" />
                        <MenuItem label="Floating IPs" />
                      </MenuSection>
                    </div>
                  </VStack>
                </div>
              </VStack>
            </Section>

            {/* ContextMenu Component */}
            <Section id="context-menu" title="Context Menu" description="Popup menu triggered by right-click or click with submenu support">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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
                  <Label>Click Trigger</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'view', label: 'View Details', onClick: () => {} },
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
                  <Label>With Submenu</Label>
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
                  <Label>Status Variants</Label>
                  <ContextMenu
                    trigger="click"
                    items={[
                      { id: 'item1', label: 'Default Item', onClick: () => {} },
                      { id: 'item2', label: 'Another Item', onClick: () => {}, divider: true },
                      { id: 'danger1', label: 'Warning Action', status: 'danger', onClick: () => {} },
                      { id: 'danger2', label: 'Delete Forever', status: 'danger', onClick: () => {} },
                    ]}
                  >
                    <Button variant="outline" size="sm">Show Status Variants</Button>
                  </ContextMenu>
                </VStack>
              </VStack>
            </Section>

            {/* Modal Component */}
            <Section id="modal" title="Modal" description="Dialog overlay for confirmations, alerts, and user interactions">
              <VStack gap={8}>
                {/* Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>padding: 16px</code> · <code>gap: 24px</code> · <code>radius: 16px</code> · <code>backdrop: black/60</code>
                  </div>
                </VStack>

                {/* Basic Modal */}
                <VStack gap={3}>
                  <Label>Basic Modal</Label>
                  <ModalDemo variant="basic" />
                </VStack>

                {/* Confirm Modal */}
                <VStack gap={3}>
                  <Label>Confirm Modal (Delete)</Label>
                  <ModalDemo variant="delete" />
                </VStack>

                {/* Sizes */}
                <VStack gap={3}>
                  <Label>Sizes</Label>
                  <div className="flex gap-2">
                    <ModalDemo variant="size-sm" />
                    <ModalDemo variant="size-md" />
                    <ModalDemo variant="size-lg" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Drawer Component */}
            <Section id="drawer" title="Drawer" description="Slide-out panel for forms, details, and secondary content">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>width: 376px (default)</code> · <code>padding-x: 24px</code> · <code>padding-y: 16px</code> · <code>animation: 300ms ease-out</code>
                  </div>
                </VStack>

                {/* Interactive Demo */}
                <VStack gap={3}>
                  <Label>Interactive Demo</Label>
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

            {/* Monitoring Toolbar */}
            <Section id="monitoring-toolbar" title="Monitoring Toolbar" description="Time range selection and refresh controls for monitoring dashboards">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
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

            {/* Notification Center */}
            <NotificationCenterSection />

            {/* Floating Card Section */}
            <Section id="floating-card" title="Floating Card" description="Floating summary card for create/edit flows with sections, quota, and actions">
              <VStack gap={8}>
                {/* Basic Example */}
                <VStack gap={4}>
                  <Label>Basic Example (Non-portal)</Label>
                  <div className="relative bg-[var(--color-surface-subtle)] p-6 rounded-lg min-h-[500px]">
                    <FloatingCard
                      title="Create Instance"
                      portal={false}
                      sections={[
                        {
                          tabTitle: 'Details',
                          collapsible: true,
                          defaultExpanded: true,
                          showSuccessIcon: true,
                          items: [
                            { id: '1', title: 'Instance Name', status: 'success' },
                            { id: '2', title: 'Description', status: 'success' },
                            { id: '3', title: 'Availability Zone', status: 'default' },
                          ],
                        },
                        {
                          tabTitle: 'Source',
                          collapsible: true,
                          defaultExpanded: false,
                          items: [
                            { id: '4', title: 'Boot Source', status: 'processing' },
                            { id: '5', title: 'Image', status: 'default' },
                          ],
                        },
                        {
                          tabTitle: 'Flavor',
                          collapsible: true,
                          defaultExpanded: false,
                          items: [
                            { id: '6', title: 'Flavor Selection', status: 'warning' },
                          ],
                        },
                      ]}
                      quota={[
                        { label: 'Instances', current: 5, total: 10 },
                        { label: 'vCPUs', current: 12, total: 20 },
                        { label: 'RAM', current: 32, total: 64, unit: 'GB' },
                      ]}
                      cancelLabel="Cancel"
                      actionLabel="Create Instance"
                      actionEnabled={false}
                      onCancel={() => console.log('Cancel clicked')}
                      onAction={() => console.log('Create clicked')}
                    />
                  </div>
                </VStack>

                {/* Status Icons */}
                <VStack gap={4}>
                  <Label>Status Icons</Label>
                  <div className="flex gap-4 items-center p-4 bg-[var(--color-surface-subtle)] rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full border border-[var(--color-border-default)]" style={{ borderStyle: 'dashed' }} />
                      <span className="text-[length:var(--font-size-12)] text-[var(--color-text-muted)]">Default</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-4 rounded-full border border-[var(--color-text-muted)] flex items-center justify-center" style={{ borderStyle: 'dashed' }}>
                        <IconRefresh size={10} stroke={2} className="text-[var(--color-text-muted)] animate-spin" />
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
                  <Label>Props Reference</Label>
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
                  <Label>Layout Specifications</Label>
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
                  <Label>Sidebar States</Label>
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
                  <Label>Layout Tokens</Label>
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

            {/* Bar Chart */}
            <Section id="bar-chart" title="Bar Chart" description="Categorical data comparison with vertical or horizontal bars">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>bar-height: 4px</code> · <code>bar-radius: 2px</code> · <code>row-gap: 22px</code> · <code>status-colors: success/warning/error</code>
                  </div>
                </VStack>

                {/* Quota Bar */}
                <VStack gap={3}>
                  <Label>Quota Bar</Label>
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

            {/* Area Chart */}
            <Section id="area-chart" title="Area Chart" description="Filled area visualization for volume and cumulative data">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>fill-opacity: 0.1</code> · <code>line-width: 1px</code> · <code>smooth: true</code> · <code>symbol-size: 6px</code>
                  </div>
                </VStack>

                {/* Basic Area Chart */}
                <VStack gap={3}>
                  <Label>Basic Area Chart</Label>
                  <AreaChartDemo variant="basic" />
                </VStack>

                {/* Stacked Area Chart */}
                <VStack gap={3}>
                  <Label>Stacked Area Chart</Label>
                  <AreaChartDemo variant="stacked" />
                </VStack>
              </VStack>
            </Section>

            {/* Pie Chart */}
            <Section id="pie-chart" title="Pie Chart" description="Part-to-whole relationships with percentage labels on slices">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>radius: 90px</code> · <code>label-threshold: 15%</code> · <code>legend: external</code> · <code>legend-scroll: 60px</code>
                  </div>
                </VStack>

                {/* Pie Charts Examples */}
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

            {/* Half-Doughnut Chart */}
            <Section id="half-doughnut-chart" title="Half-Doughnut Chart" description="Progress and metric visualization with half-circular arc design">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>arc-width: 14px</code> · <code>start-angle: 200°</code> · <code>end-angle: -20°</code> · <code>status-colors: success/warning/error</code>
                  </div>
                </VStack>

                {/* Status Variants */}
                <VStack gap={3}>
                  <Label>Status Variants</Label>
                  <div className="flex items-center gap-8 flex-wrap">
                    <HalfDoughnutChartDemo value={35} label="Safe" status="success" />
                    <HalfDoughnutChartDemo value={75} label="Warning" status="warning" />
                    <HalfDoughnutChartDemo value={95} label="Danger" status="error" />
                  </div>
                </VStack>
              </VStack>
            </Section>

            {/* Doughnut Chart */}
            <Section id="doughnut-chart" title="Doughnut Chart" description="Ring chart for part-to-whole relationships with optional center metrics">
              <VStack gap={8}>
                {/* Design Tokens */}
                <VStack gap={3}>
                  <Label>Design Tokens</Label>
                  <div className="text-[length:var(--font-size-11)] text-[var(--color-text-subtle)] p-3 bg-[var(--color-surface-muted)] rounded-[var(--radius-md)]">
                    <code>inner-radius: 68%</code> · <code>outer-radius: 80%</code> · <code>thickness: 12%</code> · <code>border-radius: 6px</code>
                  </div>
                </VStack>
                <HStack gap={3}>
                  <a
                    href="https://github.com/pob-design-system/tds/blob/main/DESIGN_SYSTEM.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-button)] text-[length:var(--font-size-12)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                  >
                    <IconFileText size={14} stroke={1.5} />
                    DESIGN_SYSTEM.md
                  </a>
                  <a
                    href="https://github.com/pob-design-system/tds/blob/main/.cursorrules"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface-default)] border border-[var(--color-border-default)] rounded-[var(--radius-button)] text-[length:var(--font-size-12)] text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] transition-colors cursor-pointer"
                  >
                    <IconCode size={14} stroke={1.5} />
                    .cursorrules
                  </a>
                </HStack>
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

function IconDisplayGrid({ title, icons }: { title: string; icons: { Icon: React.ComponentType<{ size?: number; stroke?: number; className?: string }>; name: string; missing?: boolean }[] }) {
  return (
    <VStack gap={3}>
      <Label>{title}</Label>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {icons.map(({ Icon, name, missing }, i) => (
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
