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
  IconBorderAll,
  IconAppWindow,
  IconApps,
  IconPencil,
  IconLayoutList,
  IconAccessible,
  IconBrush,
  IconChecklist,
  IconBook,
  IconComponents,
  IconDeviceDesktop,
  IconAlertTriangle,
  IconStack2,
  IconSettings,
} from '@tabler/icons-react';
import type { ComponentType } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; stroke?: number; className?: string }>;
  path: string;
  lastUpdated?: string;
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
];

const formControlItems: NavItem[] = [
  { id: 'button', label: 'Button', icon: IconClick, path: '/design/components/button' },
  { id: 'input', label: 'Input (All)', icon: IconForms, path: '/design/components/input' },
  { id: 'text-input', label: 'Text Input', icon: IconForms, path: '/design/components/text-input' },
  {
    id: 'number-input',
    label: 'Number Input',
    icon: IconForms,
    path: '/design/components/number-input',
  },
  { id: 'textarea', label: 'Textarea', icon: IconForms, path: '/design/components/textarea' },
  {
    id: 'search-input',
    label: 'Search Input',
    icon: IconForms,
    path: '/design/components/search-input',
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
    label: 'Date Picker',
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
  {
    id: 'pagination',
    label: 'Pagination',
    icon: IconProgress,
    path: '/design/components/pagination',
  },
  {
    id: 'status-indicator',
    label: 'Status indicator',
    icon: IconActivity,
    path: '/design/components/status-indicator',
  },
  { id: 'badge', label: 'Badge', icon: IconTag, path: '/design/components/badge' },
  { id: 'chip', label: 'Chip', icon: IconTag, path: '/design/components/chip' },
  { id: 'card', label: 'Card', icon: IconBorderAll, path: '/design/components/card' },
  {
    id: 'file-list-card',
    label: 'FileListCard',
    icon: IconList,
    path: '/design/components/file-list-card',
  },
  {
    id: 'expandable-checklist',
    label: 'Expandable Checklist',
    icon: IconChecklist,
    path: '/design/components/expandable-checklist',
  },
  {
    id: 'disclosure',
    label: 'Disclosure',
    icon: IconSelector,
    path: '/design/components/disclosure',
  },
];

const feedbackItems: NavItem[] = [
  {
    id: 'inline-message',
    label: 'Inline message',
    icon: IconInfoCircle,
    path: '/design/components/inline-message',
  },
  {
    id: 'loading',
    label: 'Loading',
    icon: IconLoader2,
    path: '/design/components/loading',
  },
  {
    id: 'progress-bar',
    label: 'Progress Bar',
    icon: IconProgress,
    path: '/design/components/progress-bar',
  },
  {
    id: 'skeleton',
    label: 'Skeleton',
    icon: IconStack2,
    path: '/design/components/skeleton',
  },
  {
    id: 'spinner',
    label: 'Spinner',
    icon: IconLoader2,
    path: '/design/components/spinner',
  },
  { id: 'toast', label: 'Toast', icon: IconBell, path: '/design/components/toast' },
  { id: 'snackbar', label: 'Snackbar', icon: IconBell, path: '/design/components/snackbar' },
  {
    id: 'notification-center',
    label: 'Notification center',
    icon: IconBell,
    path: '/design/components/notification-center',
  },
  {
    id: 'global-notification-panel',
    label: 'Global notification panel',
    icon: IconBell,
    path: '/design/components/global-notification-panel',
  },
];

const navigationItems: NavItem[] = [
  {
    id: 'topbar',
    label: 'Top Navigation Bar',
    icon: IconLayoutNavbar,
    path: '/design/components/topbar',
  },
  { id: 'tabbar', label: 'TabBar', icon: IconLayoutNavbar, path: '/design/components/tabbar' },
  { id: 'tabs', label: 'Tabs', icon: IconLayoutNavbar, path: '/design/components/tabs' },
  {
    id: 'breadcrumb',
    label: 'Breadcrumb',
    icon: IconChevronRight,
    path: '/design/components/breadcrumb',
  },
  {
    id: 'menu',
    label: 'Side Navigation Bar (Menu)',
    icon: IconMenu2,
    path: '/design/components/menu',
  },
  {
    id: 'window-control',
    label: 'Window Control',
    icon: IconAppWindow,
    path: '/design/components/window-control',
  },
  {
    id: 'scrollbar',
    label: 'Scrollbar',
    icon: IconLayoutSidebar,
    path: '/design/components/scrollbar',
  },
];

const overlayItems: NavItem[] = [
  { id: 'tooltip', label: 'Tooltip', icon: IconMessage2, path: '/design/components/tooltip' },
  { id: 'popover', label: 'Popover', icon: IconMessage2, path: '/design/components/popover' },
  {
    id: 'context-menu',
    label: 'Context Menu',
    icon: IconMenu2,
    path: '/design/components/context-menu',
  },
  { id: 'modal', label: 'Modal', icon: IconLayoutGrid, path: '/design/components/modal' },
  { id: 'drawer', label: 'Drawer', icon: IconLayoutGrid, path: '/design/components/drawer' },
  {
    id: 'floating-card',
    label: 'Floating card',
    icon: IconLayoutGrid,
    path: '/design/components/floating-card',
  },
];

const patternItems: NavItem[] = [
  // Page-level patterns
  { id: 'layout', label: 'Layout', icon: IconLayoutSidebar, path: '/design/patterns/layout' },
  {
    id: 'shell-pattern',
    label: 'Shell',
    icon: IconTerminal2,
    path: '/design/patterns/shell',
  },
  {
    id: 'list-page',
    label: 'List Page',
    icon: IconList,
    path: '/design/patterns/list-page',
  },
  {
    id: 'detail-page',
    label: 'Detail Page',
    icon: IconList,
    path: '/design/patterns/detail-page',
  },
  {
    id: 'empty-states',
    label: 'Empty States',
    icon: IconTemplate,
    path: '/design/patterns/empty-states',
  },
  // Section/Component patterns
  {
    id: 'detail-header',
    label: 'Detail header',
    icon: IconLayoutNavbar,
    path: '/design/patterns/detail-header',
  },
  {
    id: 'section-card',
    label: 'Section card',
    icon: IconLayoutGrid,
    path: '/design/patterns/section-card',
  },
  {
    id: 'common-patterns',
    label: 'Common patterns',
    icon: IconTemplate,
    path: '/design/patterns/common',
  },
  // Form patterns
  {
    id: 'form-field-pattern',
    label: 'Form Field',
    icon: IconForms,
    path: '/design/patterns/form-field-pattern',
  },
  {
    id: 'form-field-spacing',
    label: 'Form Field Spacing',
    icon: IconLayoutGrid,
    path: '/design/patterns/form-field',
  },
  {
    id: 'dynamic-form-fields',
    label: 'Dynamic Form Fields',
    icon: IconForms,
    path: '/design/patterns/dynamic-form-fields',
  },
  // Create flow patterns
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
  // Specialized patterns
  {
    id: 'list-selector',
    label: 'List Selector',
    icon: IconList,
    path: '/design/patterns/list-selector',
  },
  {
    id: 'view-preferences',
    label: 'View Preferences',
    icon: IconSettings,
    path: '/design/patterns/view-preferences',
  },
  {
    id: 'monitoring-toolbar',
    label: 'Monitoring toolbar',
    icon: IconRefresh,
    path: '/design/patterns/monitoring-toolbar',
  },
  {
    id: 'desktop-grid',
    label: 'Desktop Icon Grid',
    icon: IconDeviceDesktop,
    path: '/design/patterns/desktop-grid',
  },
  {
    id: 'editor',
    label: 'Editor',
    icon: IconTemplate,
    path: '/design/patterns/editor',
  },
];

const policyItems: NavItem[] = [
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: IconAccessible,
    path: '/design/policies/accessibility',
  },
  {
    id: 'ux-writing-guide',
    label: 'UX Writing Guide',
    icon: IconPencil,
    path: '/design/policies/ux-writing',
  },
  {
    id: 'csv-download',
    label: 'List Download (CSV Export)',
    icon: IconDownload,
    path: '/design/policies/csv-download',
  },
  {
    id: 'app-window',
    label: 'App Window',
    icon: IconTerminal2,
    path: '/design/policies/app-window',
  },
  {
    id: 'theming',
    label: 'Theming',
    icon: IconBrush,
    path: '/design/policies/theming',
  },
  {
    id: 'error-alert',
    label: 'Error & Alert',
    icon: IconAlertTriangle,
    path: '/design/policies/error-alert',
  },
  {
    id: 'system-error',
    label: 'System Error',
    icon: IconAlertTriangle,
    path: '/design/policies/system-error',
  },
  {
    id: 'form-validation',
    label: 'Form Validation',
    icon: IconChecklist,
    path: '/design/policies/form-validation',
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
    id: 'usage-chart',
    label: 'Usage Chart',
    icon: IconChartBar,
    path: '/design/charts/usage-chart',
  },
  { id: 'area-chart', label: 'Line Chart', icon: IconChartBar, path: '/design/charts/area-chart' },
  { id: 'pie-chart', label: 'Pie chart', icon: IconActivity, path: '/design/charts/pie-chart' },
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

const prototypeItems: NavItem[] = [
  {
    id: 'ai-workspace',
    label: 'AI Workspace Setup',
    icon: IconStack2,
    path: '/design/prototype/ai-workspace',
  },
];

const auditItems: NavItem[] = [
  {
    id: 'audit-checklist',
    label: 'Audit Checklist',
    icon: IconChecklist,
    path: '/design/audit',
  },
  {
    id: 'project-todo',
    label: 'Project TODO',
    icon: IconListNumbers,
    path: '/design/todo',
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
  { title: 'Patterns', items: patternItems },
  { title: 'Policies', items: policyItems },
  { title: 'Graphs', items: graphItems },
  { title: 'Figma Migration', items: figmaItems },
  { title: 'Audit', items: auditItems },
  { title: 'Prototype', items: prototypeItems },
  { title: 'Test', items: testItems },
];

export const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

export const pageLastUpdated: Record<string, string> = {
  // Foundation
  '/design/foundation/tokens': '2026-02-25 14:00:00',
  '/design/foundation/primitive-colors': '2026-02-25 14:00:00',
  '/design/foundation/semantic-colors': '2026-02-25 14:00:00',
  '/design/foundation/typography': '2026-02-25 14:00:00',
  '/design/foundation/spacing': '2026-02-25 14:00:00',
  '/design/foundation/borders': '2026-02-25 14:00:00',
  '/design/foundation/shadows': '2026-02-25 14:00:00',
  '/design/foundation/transitions': '2026-02-25 14:00:00',
  '/design/foundation/icons': '2026-02-25 14:00:00',
  '/design/foundation/app-icons': '2026-03-01 10:30:00',
  '/design/policies/ux-writing': '2026-03-05 13:00:00',
  '/design/policies/accessibility': '2026-02-25 14:00:00',
  '/design/policies/theming': '2026-02-25 14:00:00',
  '/design/policies/error-alert': '2026-03-09 10:30:00',
  '/design/policies/system-error': '2026-03-09 10:30:00',
  // Form Controls
  '/design/components/button': '2026-03-09 10:30:00',
  '/design/components/input': '2026-03-01 10:30:00',
  '/design/components/text-input': '2026-03-09 15:00:00',
  '/design/components/number-input': '2026-03-09 15:00:00',
  '/design/components/textarea': '2026-03-09 15:00:00',
  '/design/components/search-input': '2026-03-09 15:00:00',
  '/design/patterns/form-field': '2026-03-01 10:30:00',
  '/design/components/filter-search-input': '2026-03-09 10:30:00',
  '/design/components/select': '2026-03-09 10:30:00',
  '/design/components/datepicker': '2026-03-09',
  '/design/components/slider': '2026-03-05 13:00:00',
  '/design/components/toggle': '2026-03-09 10:30:00',
  '/design/components/checkbox': '2026-03-09 10:30:00',
  '/design/components/radio': '2026-03-09 10:30:00',
  // Data Display
  '/design/components/table': '2026-03-09 10:30:00',
  '/design/components/badge': '2026-03-05 13:00:00',
  '/design/components/card': '2026-03-09 10:30:00',
  '/design/components/chip': '2026-03-09',
  '/design/components/status-indicator': '2026-03-09 10:30:00',
  '/design/components/pagination': '2026-03-09',
  '/design/components/file-list-card': '2026-03-01 10:30:00',
  '/design/components/expandable-checklist': '2026-03-09 10:30:00',
  // Feedback
  '/design/components/inline-message': '2026-03-09 10:30:00',
  '/design/components/loading': '2026-03-09',
  '/design/components/progress-bar': '2026-03-09',
  '/design/components/skeleton': '2026-03-09',
  '/design/components/spinner': '2026-03-09',
  '/design/components/toast': '2026-03-09 10:30:00',
  '/design/components/snackbar': '2026-03-09 10:30:00',
  '/design/components/notification-center': '2026-03-09 10:30:00',
  '/design/components/global-notification-panel': '2026-03-09 10:30:00',
  // Navigation
  '/design/components/topbar': '2026-03-09',
  '/design/components/tabbar': '2026-03-09',
  '/design/components/tabs': '2026-03-09',
  '/design/components/breadcrumb': '2026-03-05 13:00:00',
  // Overlay
  '/design/components/tooltip': '2026-03-09 10:30:00',
  '/design/components/popover': '2026-03-01 10:30:00',
  '/design/components/menu': '2026-03-09',
  '/design/components/context-menu': '2026-03-09',
  '/design/components/modal': '2026-03-09 10:30:00',
  '/design/components/drawer': '2026-03-09 10:30:00',
  '/design/components/floating-card': '2026-03-05 13:00:00',
  // Layout & Patterns
  '/design/components/disclosure': '2026-03-03 18:45:00',
  '/design/components/window-control': '2026-03-09',
  '/design/components/scrollbar': '2026-03-05 13:00:00',
  '/design/patterns/common': '2026-03-01 10:30:00',
  '/design/patterns/detail-header': '2026-03-09',
  '/design/patterns/section-card': '2026-03-09',
  '/design/patterns/wizard': '2026-03-05 13:00:00',
  '/design/patterns/open-form': '2026-03-01 10:30:00',
  '/design/patterns/monitoring-toolbar': '2026-03-09',
  '/design/policies/csv-download': '2026-03-09 15:00:00',
  '/design/policies/app-window': '2026-03-09 10:30:00',
  '/design/patterns/layout': '2026-03-01 10:30:00',
  '/design/patterns/desktop-grid': '2026-03-05 10:40:00',
  '/design/patterns/dynamic-form-fields': '2026-03-01 10:30:00',
  '/design/policies/form-validation': '2026-03-01 10:30:00',
  '/design/patterns/editor': '2026-03-09',
  '/design/patterns/list-page': '2026-03-09 15:00:00',
  '/design/patterns/detail-page': '2026-03-09',
  '/design/patterns/list-selector': '2026-03-09 10:30:00',
  '/design/patterns/view-preferences': '2026-03-09 10:30:00',
  '/design/patterns/form-field-pattern': '2026-03-09 15:00:00',
  '/design/patterns/shell': '2026-03-09 15:00:00',
  '/design/patterns/empty-states': '2026-03-09',
  // Charts
  '/design/charts/overview': '2026-03-09 10:30:00',
  '/design/charts/status-colors': '2026-03-01 10:30:00',
  '/design/charts/usage-chart': '2026-03-09',
  '/design/charts/area-chart': '2026-03-09',
  '/design/charts/pie-chart': '2026-03-09',
  '/design/charts/tooltip': '2026-03-01 10:30:00',
  // Figma Migration
  '/design/figma/guide': '2026-03-01 10:30:00',
  '/design/figma/foundation': '2026-03-01 10:30:00',
  '/design/figma/components': '2026-03-01 10:30:00',
  // Prototype
  '/design/prototype/ai-workspace': '2026-03-05 14:00:00',
  // Audit
  '/design/audit': '2026-03-11 10:00:00',
  '/design/todo': '2026-03-11 12:00:00',
  // Test
  '/design/test/nested-box': '2026-03-05 01:30:00',
};
