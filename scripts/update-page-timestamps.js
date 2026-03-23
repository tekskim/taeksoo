#!/usr/bin/env node

/**
 * Automatically updates pageLastUpdated timestamps in navigationData.ts
 * based on changed files detected via git diff.
 *
 * Usage:
 *   node scripts/update-page-timestamps.js          # staged files (--cached)
 *   node scripts/update-page-timestamps.js --head    # changes in latest commit (HEAD~1)
 *   node scripts/update-page-timestamps.js --all     # all uncommitted changes
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const NAV_DATA_PATH = resolve(ROOT, 'src/pages/design/_shared/navigationData.ts');

// ---------------------------------------------------------------------------
// 1. Source file → design system route mapping
// ---------------------------------------------------------------------------

// Design page source files → route paths
// Pattern: src/pages/design/<category>/<Name>Page.tsx → /design/<category>/<kebab-name>
const PAGE_SOURCE_DIR = 'src/pages/design/';

// Special cases where filename doesn't match route slug
const FILENAME_TO_ROUTE_OVERRIDES = {
  'DrawerSectionPage.tsx': '/design/components/drawer',
  'ProgressBarComponentPage.tsx': '/design/components/progress-bar',
  'UXWritingGuidePage.tsx': '/design/policies/ux-writing',
  'SystemErrorPage.tsx': '/design/policies/system-error',
  'ErrorAlertPage.tsx': '/design/policies/error-alert',
  'AccessibilityPage.tsx': '/design/policies/accessibility',
  'AppWindowPage.tsx': '/design/policies/app-window',
  'CsvDownloadPage.tsx': '/design/policies/csv-download',
  'GlobalNotificationPanelPage.tsx': '/design/components/global-notification-panel',
  'LineChartPage.tsx': '/design/charts/area-chart',
  'ChartOverviewPage.tsx': '/design/charts/overview',
  'StatusColorsPage.tsx': '/design/charts/status-colors',
  'UsageChartPage.tsx': '/design/charts/usage-chart',
  'PieChartPage.tsx': '/design/charts/pie-chart',
  'ChartTooltipPage.tsx': '/design/charts/tooltip',
  'DesignAuditPage.tsx': '/design/audit',
  'DesignTodoPage.tsx': '/design/todo',
  'ChangelogPage.tsx': '/design/changelog',
  'SharedComponentsPage.tsx': '/design/shared-components',
  'NestedBoxTestPage.tsx': '/design/test/nested-box',
  'FigmaGuidePage.tsx': '/design/figma/guide',
  'FigmaFoundationPage.tsx': '/design/figma/foundation',
  'FigmaComponentsPage.tsx': '/design/figma/components',
  'TokenArchitecturePage.tsx': '/design/foundation/tokens',
  'SpacingPage.tsx': '/design/foundation/spacing',
  'ListPagePatternPage.tsx': '/design/patterns/list-page',
  'DetailPagePatternPage.tsx': '/design/patterns/detail-page',
  'ShellPatternPage.tsx': '/design/patterns/shell',
  'EmptyStatesPage.tsx': '/design/patterns/empty-states',
  'WizardPage.tsx': '/design/patterns/wizard',
  'OpenFormPage.tsx': '/design/patterns/open-form',
  'DesktopGridPage.tsx': '/design/patterns/desktop-grid',
  'DynamicFormFieldsPage.tsx': '/design/patterns/dynamic-form-fields',
  'ListSelectorPage.tsx': '/design/patterns/list-selector',
  'ViewPreferencesPage.tsx': '/design/patterns/view-preferences',
  'FormFieldPatternPage.tsx': '/design/patterns/form-field-pattern',
  'FormFieldPage.tsx': '/design/patterns/form-field',
  'AIWorkspacePrototypePage.tsx': '/design/prototype/ai-workspace',
  'LayoutPage.tsx': '/design/patterns/layout',
  'EditorPage.tsx': '/design/patterns/editor',
  'MonitoringToolbarPage.tsx': '/design/patterns/monitoring-toolbar',
  'DetailHeaderPage.tsx': '/design/patterns/detail-header',
  'SectionCardPage.tsx': '/design/patterns/section-card',
};

// DS component directory → documentation page route
const DS_COMPONENT_TO_ROUTE = {
  'Badge': '/design/components/badge',
  'Breadcrumb': '/design/components/breadcrumb',
  'Button': '/design/components/button',
  'Card': '/design/components/card',
  'CardTitle': '/design/components/card-title',
  'Checkbox': '/design/components/checkbox',
  'Chip': '/design/components/chip',
  'ContextMenu': '/design/components/context-menu',
  'CopyButton': '/design/components/copy-button',
  'DatePicker': '/design/components/datepicker',
  'DetailHeader': '/design/patterns/detail-header',
  'Disclosure': '/design/components/disclosure',
  'Drawer': '/design/components/drawer',
  'EmptyState': '/design/patterns/empty-states',
  'ExpandableChecklist': '/design/components/expandable-checklist',
  'FileListCard': '/design/components/file-list-card',
  'FloatingCard': '/design/components/floating-card',
  'FormField': '/design/patterns/form-field',
  'InfoBox': '/design/components/info-box',
  'InlineMessage': '/design/components/inline-message',
  'Input': '/design/components/input',
  'ListToolbar': '/design/components/list-toolbar',
  'Loading': '/design/components/loading',
  'Menu': '/design/components/menu',
  'Modal': '/design/components/modal',
  'NumberInput': '/design/components/number-input',
  'Pagination': '/design/components/pagination',
  'Popover': '/design/components/popover',
  'ProgressBar': '/design/components/progress-bar',
  'SearchInput': '/design/components/search-input',
  'SectionCard': '/design/patterns/section-card',
  'Select': '/design/components/select',
  'SelectionIndicator': '/design/components/selection-indicator',
  'Skeleton': '/design/components/skeleton',
  'Slider': '/design/components/slider',
  'StatusIndicator': '/design/components/status-indicator',
  'Table': '/design/components/table',
  'Tabs': '/design/components/tabs',
  'Textarea': '/design/components/textarea',
  'Toggle': '/design/components/toggle',
  'Tooltip': '/design/components/tooltip',
  'TopBar': '/design/components/topbar',
  'TabBar': '/design/components/tabbar',
};

function pascalToKebab(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function resolveRouteFromPageFile(filePath) {
  const fileName = filePath.split('/').pop();

  if (FILENAME_TO_ROUTE_OVERRIDES[fileName]) {
    return FILENAME_TO_ROUTE_OVERRIDES[fileName];
  }

  const match = filePath.match(/src\/pages\/design\/(\w+)\/(\w+)Page\.tsx$/);
  if (!match) return null;

  const [, category, name] = match;
  const slug = pascalToKebab(name);
  return `/design/${category}/${slug}`;
}

function resolveRouteFromDSComponent(filePath) {
  const match = filePath.match(/src\/design-system\/components\/(\w+)\//);
  if (!match) return null;
  return DS_COMPONENT_TO_ROUTE[match[1]] || null;
}

function resolveRoute(filePath) {
  if (filePath.startsWith('src/pages/design/') && filePath.endsWith('Page.tsx')) {
    return resolveRouteFromPageFile(filePath);
  }
  if (filePath.startsWith('src/design-system/components/')) {
    return resolveRouteFromDSComponent(filePath);
  }
  return null;
}

// ---------------------------------------------------------------------------
// 2. Detect changed files
// ---------------------------------------------------------------------------

function getChangedFiles(mode) {
  let cmd;
  switch (mode) {
    case '--head':
      cmd = 'git diff HEAD~1 --name-only --diff-filter=ACMR';
      break;
    case '--all':
      cmd = 'git diff --name-only --diff-filter=ACMR';
      break;
    default:
      cmd = 'git diff --cached --name-only --diff-filter=ACMR';
  }

  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// 3. Update navigationData.ts
// ---------------------------------------------------------------------------

function updateTimestamps(routes) {
  if (routes.length === 0) {
    console.log('No design system page timestamps to update.');
    return;
  }

  let content = readFileSync(NAV_DATA_PATH, 'utf-8');
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  let updated = 0;
  for (const route of routes) {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`('${escaped}':\\s*)'[^']*'`);
    if (regex.test(content)) {
      content = content.replace(regex, `$1'${timestamp}'`);
      updated++;
      console.log(`  Updated: ${route} → ${timestamp}`);
    } else {
      console.log(`  Skipped (not in pageLastUpdated): ${route}`);
    }
  }

  if (updated > 0) {
    writeFileSync(NAV_DATA_PATH, content, 'utf-8');
    console.log(`\nUpdated ${updated} timestamp(s) in navigationData.ts`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const mode = process.argv[2] || '--cached';
console.log(`Detecting changed files (mode: ${mode})...\n`);

const changedFiles = getChangedFiles(mode);
const routeSet = new Set();

for (const file of changedFiles) {
  const route = resolveRoute(file);
  if (route) routeSet.add(route);
}

if (routeSet.size > 0) {
  console.log(`Found ${routeSet.size} design system page(s) to update:\n`);
  updateTimestamps([...routeSet]);
} else {
  console.log('No design system pages affected by the current changes.');
}
