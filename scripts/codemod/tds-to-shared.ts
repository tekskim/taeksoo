/**
 * TDS → thaki-shared codemod transformer
 *
 * Usage:
 *   npx ts-node scripts/codemod/tds-to-shared.ts <file-or-glob>
 *   npx ts-node scripts/codemod/tds-to-shared.ts src/pages/AgentPage.tsx
 *   npx ts-node scripts/codemod/tds-to-shared.ts --dry-run src/pages/AgentPage.tsx
 *
 * What it does:
 *   1. Rewrites `@/design-system` imports → `@thaki/shared` with component renaming
 *   2. Transforms component JSX props according to mapping rules
 *   3. Outputs a migration report with manual-review items
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Mapping definitions
// ---------------------------------------------------------------------------

const BUTTON_VARIANT_MAP: Record<string, { variant: string; appearance: string }> = {
  primary: { variant: 'primary', appearance: 'solid' },
  secondary: { variant: 'secondary', appearance: 'solid' },
  outline: { variant: 'secondary', appearance: 'outline' },
  ghost: { variant: 'secondary', appearance: 'ghost' },
  muted: { variant: 'muted', appearance: 'solid' },
  danger: { variant: 'error', appearance: 'solid' },
  warning: { variant: 'warning', appearance: 'solid' },
  link: { variant: 'secondary', appearance: 'ghost' },
};

const BADGE_VARIANT_MAP: Record<string, string> = {
  info: 'blu',
  success: 'gre',
  warning: 'ylw',
  danger: 'red',
  neutral: 'gry',
};

const GAP_MAP: Record<string, string> = {
  '0': '0',
  '0.5': 'xs',
  '1': 'xs',
  '2': 'sm',
  '3': 'sm',
  '4': 'md',
  '6': 'lg',
  '8': 'lg',
};

const IMPORT_RENAME_MAP: Record<string, string | null> = {
  Button: 'Button',
  VStack: null, // Layout.VStack (namespace)
  HStack: null, // Layout.HStack (namespace)
  Table: 'Table',
  Pagination: 'Pagination',
  SearchInput: null, // no equivalent
  Badge: 'Badge',
  StatusIndicator: 'StatusIndicator',
  ContextMenu: 'ContextMenu',
  TabBar: 'TabBar',
  Breadcrumb: 'Breadcrumb',
  Modal: null, // Overlay.Template
  Drawer: null, // Overlay.Template
  Tabs: 'TabSelector',
  DetailHeader: 'DetailPageHeader',
  EmptyState: 'EmptyUI',
  Tooltip: 'Tooltip',
  FormField: 'FormField',
  Input: 'Input',
  Select: null, // Dropdown.Select
  Toggle: 'Toggle',
  Checkbox: 'Checkbox',
  PageShell: null, // no equivalent
  PageHeader: null, // compose manually
  TopBar: null,
  TopBarAction: null,
  ListToolbar: null, // ToolBar
  SectionCard: null, // Fieldset
};

// Components that need Layout namespace
const LAYOUT_COMPONENTS = new Set(['VStack', 'HStack', 'Container']);
// Components that need Overlay namespace
const OVERLAY_COMPONENTS = new Set(['Modal', 'Drawer']);

interface MigrationIssue {
  line: number;
  component: string;
  issue: string;
  severity: 'auto' | 'manual' | 'breaking';
}

// ---------------------------------------------------------------------------
// Transform functions
// ---------------------------------------------------------------------------

function transformImports(source: string, issues: MigrationIssue[]): string {
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@\/design-system['"]/g;

  let match: RegExpExecArray | null;
  const tdsImports: string[] = [];

  while ((match = importRegex.exec(source)) !== null) {
    const names = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    tdsImports.push(...names);
  }

  if (tdsImports.length === 0) return source;

  const sharedImports: string[] = [];
  const needLayout = tdsImports.some((n) => LAYOUT_COMPONENTS.has(n.replace(/^type\s+/, '')));
  const needOverlay = tdsImports.some((n) => OVERLAY_COMPONENTS.has(n.replace(/^type\s+/, '')));
  const noEquivalent: string[] = [];

  for (const rawName of tdsImports) {
    const isType = rawName.startsWith('type ');
    const name = rawName.replace(/^type\s+/, '');

    if (LAYOUT_COMPONENTS.has(name)) {
      if (!sharedImports.includes('Layout')) sharedImports.push('Layout');
      continue;
    }
    if (OVERLAY_COMPONENTS.has(name)) {
      if (!sharedImports.includes('Overlay')) sharedImports.push('Overlay');
      continue;
    }

    const mapped = IMPORT_RENAME_MAP[name];
    if (mapped === undefined) {
      // Type or unknown — keep as-is for manual review
      sharedImports.push(rawName);
    } else if (mapped === null) {
      noEquivalent.push(name);
      issues.push({
        line: 0,
        component: name,
        issue: `No direct equivalent in @thaki/shared. Manual migration needed.`,
        severity: 'manual',
      });
    } else {
      sharedImports.push(isType ? `type ${mapped}` : mapped);
    }
  }

  if (needLayout && !sharedImports.includes('Layout')) {
    sharedImports.push('Layout');
  }
  if (needOverlay && !sharedImports.includes('Overlay')) {
    sharedImports.push('Overlay');
  }

  const newImport = `import {\n  ${sharedImports.join(',\n  ')},\n} from '@thaki/shared';`;

  let result = source.replace(importRegex, '');
  // Remove empty lines left by removed imports
  result = result.replace(/^\s*\n{2,}/gm, '\n');

  // Insert new import at the top (after any existing non-design-system imports)
  const firstImportIdx = result.indexOf('import ');
  if (firstImportIdx >= 0) {
    result = result.slice(0, firstImportIdx) + newImport + '\n' + result.slice(firstImportIdx);
  } else {
    result = newImport + '\n' + result;
  }

  if (noEquivalent.length > 0) {
    const comment = `// TODO: [codemod] These TDS components have no direct @thaki/shared equivalent:\n// ${noEquivalent.join(', ')}\n// Manual migration required.\n`;
    result = result.replace(newImport, comment + newImport);
  }

  return result;
}

function transformButtonProps(source: string, issues: MigrationIssue[]): string {
  // Match Button with variant prop
  const buttonVariantRegex = /<Button\b([^>]*?)variant="(\w+)"([^>]*?)>/g;

  return source.replace(buttonVariantRegex, (full, before, variant, after) => {
    const mapped = BUTTON_VARIANT_MAP[variant];
    if (!mapped) {
      issues.push({
        line: 0,
        component: 'Button',
        issue: `Unknown variant="${variant}". Manual check needed.`,
        severity: 'manual',
      });
      return full;
    }
    return `<Button${before}variant="${mapped.variant}" appearance="${mapped.appearance}"${after}>`;
  });
}

function transformVStackHStack(source: string, issues: MigrationIssue[]): string {
  let result = source;

  // Replace <VStack → <Layout.VStack and </VStack> → </Layout.VStack>
  for (const comp of ['VStack', 'HStack']) {
    const openRegex = new RegExp(`<${comp}\\b`, 'g');
    const closeRegex = new RegExp(`</${comp}>`, 'g');
    result = result.replace(openRegex, `<Layout.${comp}`);
    result = result.replace(closeRegex, `</Layout.${comp}>`);

    // Transform numeric gap to token
    const gapRegex = new RegExp(`(<Layout\\.${comp}[^>]*?)gap=\\{(\\d+(?:\\.\\d+)?)\\}`, 'g');
    result = result.replace(gapRegex, (_, prefix, gapValue) => {
      const token = GAP_MAP[gapValue];
      if (token) {
        return `${prefix}gap="${token}"`;
      }
      issues.push({
        line: 0,
        component: comp,
        issue: `gap={${gapValue}} has no token mapping. Manual adjustment needed.`,
        severity: 'manual',
      });
      return `${prefix}gap={${gapValue}} /* TODO: map to token */`;
    });
  }

  return result;
}

function transformBadgeProps(source: string, issues: MigrationIssue[]): string {
  const badgeVariantRegex = /<Badge\b([^>]*?)variant="(\w+)"([^>]*?)>/g;
  return source.replace(badgeVariantRegex, (full, before, variant, after) => {
    const mapped = BADGE_VARIANT_MAP[variant];
    if (!mapped) {
      issues.push({
        line: 0,
        component: 'Badge',
        issue: `Unknown variant="${variant}". Manual check needed.`,
        severity: 'manual',
      });
      return full;
    }
    return `<Badge${before}theme="${mapped}"${after}>`;
  });
}

function transformStatusIndicator(source: string, issues: MigrationIssue[]): string {
  let result = source;

  // status prop → variant prop
  result = result.replace(/(<StatusIndicator\b[^>]*?)status="(\w+)"/g, '$1variant="$2"');
  result = result.replace(/(<StatusIndicator\b[^>]*?)status=\{([^}]+)\}/g, '$1variant={$2}');

  // layout="icon-only" → layout="iconOnly"
  result = result.replace(/(<StatusIndicator\b[^>]*?)layout="icon-only"/g, '$1layout="iconOnly"');

  return result;
}

function transformPagination(source: string, issues: MigrationIssue[]): string {
  let result = source;

  result = result.replace(/(<Pagination\b[^>]*?)currentPage=/g, '$1currentAt=');
  result = result.replace(/(<Pagination\b[^>]*?)totalItems=/g, '$1totalCount=');

  if (/totalPages=/.test(result)) {
    issues.push({
      line: 0,
      component: 'Pagination',
      issue: `totalPages prop → use totalCount + size instead in @thaki/shared.`,
      severity: 'manual',
    });
  }

  return result;
}

function transformTabBar(source: string, issues: MigrationIssue[]): string {
  let result = source;

  result = result.replace(/(<TabBar\b[^>]*?)onTabChange=/g, '$1onTabClick=');
  result = result.replace(/(<TabBar\b[^>]*?)onTabAdd=/g, '$1onAddTab=');

  // Tab item label → title
  if (/label:\s*tab\.label/.test(result) || /label:\s*t\.label/.test(result)) {
    issues.push({
      line: 0,
      component: 'TabBar',
      issue: `TabBarItem.label → TabItem.title. Update tab mapping objects.`,
      severity: 'manual',
    });
  }

  return result;
}

function transformBreadcrumb(source: string, issues: MigrationIssue[]): string {
  if (/href:/.test(source) && /Breadcrumb/.test(source)) {
    issues.push({
      line: 0,
      component: 'Breadcrumb',
      issue: `BreadcrumbItem.href → BreadcrumbItem.path in @thaki/shared.`,
      severity: 'manual',
    });
  }
  return source;
}

function transformTooltip(source: string, _issues: MigrationIssue[]): string {
  return source.replace(/(<Tooltip\b[^>]*?)position="(\w+)"/g, '$1direction="$2"');
}

function transformModal(source: string, issues: MigrationIssue[]): string {
  if (/<Modal\b/.test(source)) {
    issues.push({
      line: 0,
      component: 'Modal',
      issue: `<Modal> → <Overlay.Template type="modal">. Props: isOpen→appeared, onClose→onCancel. Manual restructure needed.`,
      severity: 'breaking',
    });
  }
  if (/<Drawer\b/.test(source)) {
    issues.push({
      line: 0,
      component: 'Drawer',
      issue: `<Drawer> → <Overlay.Template type="drawer-horizontal">. Props: isOpen→appeared, onClose→onCancel. Manual restructure needed.`,
      severity: 'breaking',
    });
  }
  return source;
}

function transformTable(source: string, issues: MigrationIssue[]): string {
  let result = source;

  // onRowClick → onClickRow
  result = result.replace(/(<Table\b[^>]*?)onRowClick=/g, '$1onClickRow=');

  if (/selectable/.test(result) && /Table/.test(result)) {
    issues.push({
      line: 0,
      component: 'Table',
      issue: `@thaki/shared Table has no built-in selectable prop. Selection must be implemented via custom column.`,
      severity: 'breaking',
    });
  }

  if (/emptyMessage=/.test(result)) {
    issues.push({
      line: 0,
      component: 'Table',
      issue: `emptyMessage → use emptyUI={<EmptyUI content={{title: "..."}} />} prop.`,
      severity: 'manual',
    });
  }

  if (/\bdata=/.test(result) && /Table/.test(result)) {
    issues.push({
      line: 0,
      component: 'Table',
      issue: `Table data prop → rows in @thaki/shared.`,
      severity: 'manual',
    });
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

function transform(source: string, filePath: string): { output: string; issues: MigrationIssue[] } {
  const issues: MigrationIssue[] = [];
  let result = source;

  result = transformImports(result, issues);
  result = transformButtonProps(result, issues);
  result = transformVStackHStack(result, issues);
  result = transformBadgeProps(result, issues);
  result = transformStatusIndicator(result, issues);
  result = transformPagination(result, issues);
  result = transformTabBar(result, issues);
  result = transformBreadcrumb(result, issues);
  result = transformTooltip(result, issues);
  result = transformModal(result, issues);
  result = transformTable(result, issues);

  return { output: result, issues };
}

function generateReport(filePath: string, issues: MigrationIssue[]): string {
  const lines: string[] = [
    `\n${'='.repeat(60)}`,
    `Migration Report: ${filePath}`,
    `${'='.repeat(60)}`,
    `Total issues: ${issues.length}`,
    `  - Auto-fixed: ${issues.filter((i) => i.severity === 'auto').length}`,
    `  - Manual review: ${issues.filter((i) => i.severity === 'manual').length}`,
    `  - Breaking changes: ${issues.filter((i) => i.severity === 'breaking').length}`,
    '',
  ];

  for (const issue of issues) {
    const icon = issue.severity === 'auto' ? '✅' : issue.severity === 'manual' ? '⚠️' : '🔴';
    lines.push(`${icon} [${issue.component}] ${issue.issue}`);
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const files = args.filter((a) => !a.startsWith('--'));

  if (files.length === 0) {
    console.log('Usage: npx ts-node scripts/codemod/tds-to-shared.ts [--dry-run] <file...>');
    console.log('Example: npx ts-node scripts/codemod/tds-to-shared.ts src/pages/AgentPage.tsx');
    process.exit(1);
  }

  for (const file of files) {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }

    const source = fs.readFileSync(filePath, 'utf-8');
    const { output, issues } = transform(source, filePath);

    console.log(generateReport(file, issues));

    if (dryRun) {
      console.log('\n--- DRY RUN: Would write ---');
      const diff = source !== output;
      console.log(diff ? `File would be modified (${output.length} chars)` : 'No changes');
    } else {
      if (source !== output) {
        fs.writeFileSync(filePath, output, 'utf-8');
        console.log(`\n✅ File updated: ${file}`);
      } else {
        console.log(`\nℹ️  No changes needed: ${file}`);
      }
    }
  }
}

main();
