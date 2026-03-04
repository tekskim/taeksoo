import {
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
  IconSearch,
  IconCalendar,
  IconAdjustments,
  IconList,
  IconActivity,
  IconProgress,
  IconInfoCircle,
  IconLoader2,
  IconChevronRight,
  IconMessage2,
  IconBell,
  IconStar,
  IconTemplate,
  IconListNumbers,
  IconRefresh,
  IconDownload,
  IconTerminal2,
  IconLayoutSidebar,
  IconChartBar,
  IconGauge,
  IconChartDonut,
  IconBorderAll,
  IconAppWindow,
  IconApps,
  IconPencil,
  IconLayoutList,
  IconAccessible,
  IconBrush,
  IconChecklist,
  IconUsers,
  IconFileOff,
  IconBook,
  IconComponents,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
  path: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

const foundationItems: NavItem[] = [
  {
    id: 'token-architecture',
    label: 'Token architecture',
    icon: IconLayoutGrid,
    path: '/design/foundation/tokens',
  },
  {
    id: 'primitive-colors',
    label: 'Primitive colors',
    icon: IconPalette,
    path: '/design/foundation/primitive-colors',
  },
  {
    id: 'semantic-colors',
    label: 'Semantic colors',
    icon: IconPalette,
    path: '/design/foundation/semantic-colors',
  },
  {
    id: 'typography',
    label: 'Typography',
    icon: IconTypography,
    path: '/design/foundation/typography',
  },
  {
    id: 'spacing-radius',
    label: 'Spacing & Radius',
    icon: IconBoxMultiple,
    path: '/design/foundation/spacing',
  },
  { id: 'borders', label: 'Borders', icon: IconBorderAll, path: '/design/foundation/borders' },
  { id: 'shadows', label: 'Shadows', icon: IconBoxMultiple, path: '/design/foundation/shadows' },
  {
    id: 'transitions',
    label: 'Transitions',
    icon: IconActivity,
    path: '/design/foundation/transitions',
  },
  { id: 'icons', label: 'Icons', icon: IconStar, path: '/design/foundation/icons' },
  { id: 'app-icons', label: 'App icons', icon: IconApps, path: '/design/foundation/app-icons' },
  {
    id: 'ux-writing-guide',
    label: 'UX Writing Guide',
    icon: IconPencil,
    path: '/design/foundation/ux-writing',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: IconAccessible,
    path: '/design/foundation/accessibility',
  },
  {
    id: 'theming',
    label: 'Theming',
    icon: IconBrush,
    path: '/design/foundation/theming',
  },
  {
    id: 'contributing',
    label: 'Contributing',
    icon: IconUsers,
    path: '/design/foundation/contributing',
  },
];

const formControlItems: NavItem[] = [
  { id: 'button', label: 'Button', icon: IconClick, path: '/design/components/button' },
  { id: 'input', label: 'Input', icon: IconForms, path: '/design/components/input' },
  {
    id: 'form-field-spacing',
    label: 'Form Field Spacing',
    icon: IconLayoutGrid,
    path: '/design/components/form-field',
  },
  {
    id: 'filter-search-input',
    label: 'Filter search Input',
    icon: IconSearch,
    path: '/design/components/filter-search-input',
  },
  { id: 'select', label: 'Select', icon: IconSelector, path: '/design/components/select' },
  {
    id: 'datepicker',
    label: 'DatePicker',
    icon: IconCalendar,
    path: '/design/components/datepicker',
  },
  { id: 'slider', label: 'Slider', icon: IconAdjustments, path: '/design/components/slider' },
  { id: 'toggle', label: 'Toggle', icon: IconToggleRight, path: '/design/components/toggle' },
  { id: 'checkbox', label: 'Checkbox', icon: IconSquareCheck, path: '/design/components/checkbox' },
  { id: 'radio', label: 'Radio', icon: IconCircle, path: '/design/components/radio' },
];

const dataDisplayItems: NavItem[] = [
  { id: 'table', label: 'Table', icon: IconList, path: '/design/components/table' },
  { id: 'badge', label: 'Badge', icon: IconTag, path: '/design/components/badge' },
  { id: 'chip', label: 'Chip', icon: IconTag, path: '/design/components/chip' },
  {
    id: 'status-indicator',
    label: 'Status indicator',
    icon: IconActivity,
    path: '/design/components/status-indicator',
  },
  {
    id: 'pagination',
    label: 'Pagination',
    icon: IconProgress,
    path: '/design/components/pagination',
  },
  {
    id: 'selection-indicator',
    label: 'SelectionIndicator',
    icon: IconSquareCheck,
    path: '/design/components/selection-indicator',
  },
  {
    id: 'file-list-card',
    label: 'FileListCard',
    icon: IconList,
    path: '/design/components/file-list-card',
  },
];

const feedbackItems: NavItem[] = [
  {
    id: 'inline-message',
    label: 'Inline message',
    icon: IconInfoCircle,
    path: '/design/components/inline-message',
  },
  { id: 'loading', label: 'Loading', icon: IconLoader2, path: '/design/components/loading' },
  {
    id: 'empty-state',
    label: 'EmptyState / ErrorState',
    icon: IconFileOff,
    path: '/design/components/empty-state',
  },
];

const navigationItems: NavItem[] = [
  { id: 'topbar', label: 'TopBar', icon: IconLayoutNavbar, path: '/design/components/topbar' },
  { id: 'tabbar', label: 'TabBar', icon: IconLayoutNavbar, path: '/design/components/tabbar' },
  { id: 'tabs', label: 'Tabs', icon: IconLayoutNavbar, path: '/design/components/tabs' },
  {
    id: 'breadcrumb',
    label: 'Breadcrumb',
    icon: IconChevronRight,
    path: '/design/components/breadcrumb',
  },
];

const overlayItems: NavItem[] = [
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2, path: '/design/components/tooltip' },
  { id: 'popover', label: 'Popover', icon: IconMessage2, path: '/design/components/popover' },
  { id: 'menu', label: 'Menu', icon: IconMenu2, path: '/design/components/menu' },
  {
    id: 'context-menu',
    label: 'Context menu',
    icon: IconMenu2,
    path: '/design/components/context-menu',
  },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid, path: '/design/components/modal' },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid, path: '/design/components/drawer' },
  {
    id: 'notification-center',
    label: 'Notification center',
    icon: IconBell,
    path: '/design/components/notification-center',
  },
  { id: 'toast', label: 'Toast', icon: IconBell, path: '/design/components/toast' },
  {
    id: 'global-notification-panel',
    label: 'Global notification panel',
    icon: IconBell,
    path: '/design/components/global-notification-panel',
  },
  {
    id: 'floating-card',
    label: 'Floating card',
    icon: IconLayoutGrid,
    path: '/design/components/floating-card',
  },
];

const layoutItems: NavItem[] = [
  {
    id: 'disclosure',
    label: 'Disclosure',
    icon: IconSelector,
    path: '/design/components/disclosure',
  },
  {
    id: 'window-control',
    label: 'Window control',
    icon: IconAppWindow,
    path: '/design/components/window-control',
  },
  {
    id: 'scrollbar',
    label: 'Scrollbar',
    icon: IconLayoutSidebar,
    path: '/design/components/scrollbar',
  },
  {
    id: 'common-patterns',
    label: 'Common patterns',
    icon: IconTemplate,
    path: '/design/patterns/common',
  },
  {
    id: 'detail-header',
    label: 'Detail header',
    icon: IconLayoutNavbar,
    path: '/design/components/detail-header',
  },
  {
    id: 'section-card',
    label: 'Section card',
    icon: IconLayoutGrid,
    path: '/design/components/section-card',
  },
  {
    id: 'wizard',
    label: 'Wizard (Create Flow)',
    icon: IconListNumbers,
    path: '/design/patterns/wizard',
  },
  {
    id: 'open-form',
    label: 'Open Form (Create Flow)',
    icon: IconLayoutList,
    path: '/design/patterns/open-form',
  },
  {
    id: 'multi-tab-create',
    label: 'Multi Tab Create',
    icon: IconListNumbers,
    path: '/design/patterns/multi-tab-create',
  },
  {
    id: 'monitoring-toolbar',
    label: 'Monitoring toolbar',
    icon: IconRefresh,
    path: '/design/components/monitoring-toolbar',
  },
  {
    id: 'csv-download',
    label: 'CSV file download',
    icon: IconDownload,
    path: '/design/components/csv-download',
  },
  { id: 'shell', label: 'Shell', icon: IconTerminal2, path: '/design/components/shell' },
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar, path: '/design/patterns/layout' },
  {
    id: 'dynamic-form-fields',
    label: 'Dynamic Form Fields',
    icon: IconForms,
    path: '/design/patterns/dynamic-form-fields',
  },
  {
    id: 'form-validation',
    label: 'Form Validation',
    icon: IconChecklist,
    path: '/design/patterns/form-validation',
  },
];

const graphItems: NavItem[] = [
  {
    id: 'chart-overview',
    label: 'Chart overview',
    icon: IconChartBar,
    path: '/design/charts/overview',
  },
  {
    id: 'status-colors',
    label: 'Status colors',
    icon: IconPalette,
    path: '/design/charts/status-colors',
  },
  {
    id: 'gauge-bar-chart',
    label: 'Gauge bar chart',
    icon: IconChartBar,
    path: '/design/charts/gauge-bar',
  },
  { id: 'area-chart', label: 'Area chart', icon: IconChartBar, path: '/design/charts/area-chart' },
  { id: 'pie-chart', label: 'Pie chart', icon: IconActivity, path: '/design/charts/pie-chart' },
  {
    id: 'half-doughnut-chart',
    label: 'Half-Doughnut chart',
    icon: IconGauge,
    path: '/design/charts/half-doughnut',
  },
  {
    id: 'doughnut-chart',
    label: 'Doughnut chart',
    icon: IconChartDonut,
    path: '/design/charts/doughnut',
  },
  {
    id: 'chart-tooltip',
    label: 'Chart tooltip',
    icon: IconMessage2,
    path: '/design/charts/tooltip',
  },
];

const figmaItems: NavItem[] = [
  {
    id: 'figma-guide',
    label: 'Migration Guide',
    icon: IconBook,
    path: '/design/figma/guide',
  },
  {
    id: 'figma-foundation',
    label: 'Foundation Capture',
    icon: IconPalette,
    path: '/design/figma/foundation',
  },
  {
    id: 'figma-components',
    label: 'Components Capture',
    icon: IconComponents,
    path: '/design/figma/components',
  },
];

const testItems: NavItem[] = [
  {
    id: 'nested-box-test',
    label: 'Nested Box',
    icon: IconBoxMultiple,
    path: '/design/test/nested-box',
  },
];

export const navGroups: NavGroup[] = [
  { title: 'Foundation', items: foundationItems },
  { title: 'Form Controls', items: formControlItems },
  { title: 'Data Display', items: dataDisplayItems },
  { title: 'Feedback', items: feedbackItems },
  { title: 'Navigation', items: navigationItems },
  { title: 'Overlay', items: overlayItems },
  { title: 'Layout', items: layoutItems },
  { title: 'Graphs', items: graphItems },
  { title: 'Figma Migration', items: figmaItems },
  { title: 'Test', items: testItems },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);
