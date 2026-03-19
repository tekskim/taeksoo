import { test, expect, Browser, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TDS_BASE = 'http://localhost:5173';
const SHARED_BASE = 'http://localhost:5177';

const OUTPUT_DIR = path.resolve(__dirname, '../../visual-report');

const IAM_PAGES = [
  { name: 'iam-home', path: '/iam' },
  { name: 'iam-users-list', path: '/iam/users' },
  { name: 'iam-users-detail', path: '/iam/users/thaki-kim' },
  { name: 'iam-user-groups-list', path: '/iam/user-groups' },
  { name: 'iam-user-groups-detail', path: '/iam/user-groups/dev-admin-group' },
  { name: 'iam-roles-list', path: '/iam/roles' },
  { name: 'iam-roles-detail', path: '/iam/roles/viewer' },
  { name: 'iam-policies-list', path: '/iam/policies' },
  { name: 'iam-policies-detail', path: '/iam/policies/ReadCompute' },
  { name: 'iam-active-sessions', path: '/iam/active-sessions' },
  { name: 'iam-domains', path: '/iam/domains' },
  { name: 'iam-system-admins-list', path: '/iam/system-administrators' },
  { name: 'iam-system-admins-detail', path: '/iam/system-administrators/thaki-kim' },
  { name: 'iam-event-logs', path: '/iam/event-logs' },
  { name: 'iam-mfa-policies', path: '/iam/mfa-policies' },
  { name: 'iam-session-policies', path: '/iam/session-policies' },
  { name: 'iam-token-policies', path: '/iam/token-policies' },
  { name: 'iam-login-policies', path: '/iam/login-policies' },
];

/* ─── Style diff extraction config ─── */

const STYLE_PROPERTIES = [
  'width', 'height', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'gap', 'rowGap', 'columnGap',
  'fontSize', 'fontWeight', 'lineHeight', 'color',
  'backgroundColor', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
  'borderColor', 'borderRadius', 'boxShadow',
] as const;

interface ElementTarget {
  name: string;
  tdsSelector: string;
  sharedSelector: string;
  component: string;
  styleFile: string;
}

const ELEMENT_TARGETS: ElementTarget[] = [
  {
    name: 'Sidebar container',
    tdsSelector: 'aside',
    sharedSelector: 'aside',
    component: 'Sidebar',
    styleFile: 'src/components/Sidebar/Sidebar.styles.ts',
  },
  {
    name: 'Sidebar content',
    tdsSelector: 'aside nav',
    sharedSelector: 'aside > div',
    component: 'Sidebar',
    styleFile: 'src/components/Sidebar/Sidebar.styles.ts',
  },
  {
    name: 'TabBar container',
    tdsSelector: '[data-figma-name="[TDS] TabBar"]',
    sharedSelector: '.bg-surface.h-9',
    component: 'TabBar',
    styleFile: 'src/components/TabBar/TabBar.styles.ts',
  },
  {
    name: 'First TabItem',
    tdsSelector: '[data-tab-id]',
    sharedSelector: '[role="tab"]',
    component: 'TabBar',
    styleFile: 'src/components/TabBar/TabItem.styles.ts',
  },
  {
    name: 'Page heading',
    tdsSelector: 'main h1',
    sharedSelector: 'main h2, main h1',
    component: 'PageHeader',
    styleFile: 'preview layout',
  },
  {
    name: 'Table',
    tdsSelector: 'main table',
    sharedSelector: 'main table',
    component: 'Table',
    styleFile: 'src/components/TcTable/',
  },
  {
    name: 'Table header row',
    tdsSelector: 'main table thead tr',
    sharedSelector: 'main table thead tr',
    component: 'Table',
    styleFile: 'src/components/TcTable/',
  },
  {
    name: 'Table body first row',
    tdsSelector: 'main table tbody tr:first-child',
    sharedSelector: 'main table tbody tr:first-child',
    component: 'Table',
    styleFile: 'src/components/TcTable/',
  },
  {
    name: 'Primary button',
    tdsSelector: 'main button:has-text("Create")',
    sharedSelector: 'main button:has-text("Create")',
    component: 'Button',
    styleFile: 'src/components/Button/Button.styles.ts',
  },
  {
    name: 'Search input wrapper',
    tdsSelector: 'main input[placeholder*="Search"]',
    sharedSelector: 'main input[placeholder*="Search"] >> xpath=..',
    component: 'FilterSearch',
    styleFile: 'src/components/FilterSearch/FilterSearch.styles.ts',
  },
  {
    name: 'Search input element',
    tdsSelector: 'main input[placeholder*="Search"]',
    sharedSelector: 'main input[placeholder*="Search"]',
    component: 'FilterSearch',
    styleFile: 'src/components/FilterSearch/FilterSearch.styles.ts',
  },
  {
    name: 'Sidebar menu item (active)',
    tdsSelector: 'aside nav a[data-active="true"]',
    sharedSelector: 'aside button[class*="info-weak"], aside button[class*="bg-info"]',
    component: 'Sidebar',
    styleFile: 'src/components/Sidebar/Sidebar.styles.ts',
  },
];

interface StyleDiff {
  element: string;
  component: string;
  styleFile: string;
  property: string;
  tds: string;
  shared: string;
  severity: 'critical' | 'major' | 'minor';
}

interface PageStyleReport {
  route: string;
  pageName: string;
  diffs: StyleDiff[];
  pixelDiff?: { diffPixels: number; diffPercent: number };
}

function classifySeverity(property: string, tdsVal: string, sharedVal: string): 'critical' | 'major' | 'minor' {
  if (property === 'height' || property === 'width') {
    const tdsNum = parseFloat(tdsVal);
    const sharedNum = parseFloat(sharedVal);
    if (!isNaN(tdsNum) && !isNaN(sharedNum) && Math.abs(tdsNum - sharedNum) > 8) return 'critical';
    if (!isNaN(tdsNum) && !isNaN(sharedNum) && Math.abs(tdsNum - sharedNum) > 2) return 'major';
  }
  if (property === 'fontSize' || property === 'fontWeight' || property === 'lineHeight') return 'major';
  if (property.startsWith('padding') || property.startsWith('margin') || property === 'gap') return 'major';
  if (property === 'backgroundColor' || property === 'color') return 'minor';
  if (property.startsWith('border')) return 'minor';
  return 'minor';
}

async function extractStyles(page: Page, selector: string): Promise<Record<string, string> | null> {
  try {
    const el = page.locator(selector).first();
    if (!(await el.count())) return null;
    return await el.evaluate((node, props) => {
      const cs = window.getComputedStyle(node);
      const result: Record<string, string> = {};
      for (const p of props) {
        result[p] = cs.getPropertyValue(
          p.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
        );
      }
      result['__boundingHeight'] = String(node.getBoundingClientRect().height);
      result['__boundingWidth'] = String(node.getBoundingClientRect().width);
      return result;
    }, [...STYLE_PROPERTIES]);
  } catch {
    return null;
  }
}

async function captureFullPage(browser: Browser, url: string, outputPath: string) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: outputPath, fullPage: false });
  await context.close();
}

function comparePNGs(img1Path: string, img2Path: string, diffPath: string) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const norm1 = new PNG({ width, height });
  const norm2 = new PNG({ width, height });
  const diff = new PNG({ width, height });

  PNG.bitblt(img1, norm1, 0, 0, Math.min(img1.width, width), Math.min(img1.height, height), 0, 0);
  PNG.bitblt(img2, norm2, 0, 0, Math.min(img2.width, width), Math.min(img2.height, height), 0, 0);

  const diffPixels = pixelmatch(norm1.data, norm2.data, diff.data, width, height, {
    threshold: 0.3,
    includeAA: false,
  });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  return {
    tdsSize: `${img1.width}x${img1.height}`,
    sharedSize: `${img2.width}x${img2.height}`,
    diffPixels,
    totalPixels: width * height,
    diffPercent: Number(((diffPixels / (width * height)) * 100).toFixed(2)),
  };
}

test('IAM visual regression: capture + compare all pages', async ({ browser }) => {
  fs.mkdirSync(path.join(OUTPUT_DIR, 'tds'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'shared-v2'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'diff'), { recursive: true });

  const results: Array<{
    page: string;
    tdsSize: string;
    sharedSize: string;
    diffPixels: number;
    diffPercent: number;
    status: string;
  }> = [];

  for (const pg of IAM_PAGES) {
    const tdsPath = path.join(OUTPUT_DIR, 'tds', `${pg.name}.png`);
    const sharedPath = path.join(OUTPUT_DIR, 'shared-v2', `${pg.name}.png`);
    const diffPath = path.join(OUTPUT_DIR, 'diff', `${pg.name}-diff.png`);

    await captureFullPage(browser, `${TDS_BASE}${pg.path}`, tdsPath);
    await captureFullPage(browser, `${SHARED_BASE}${pg.path}`, sharedPath);

    const result = comparePNGs(tdsPath, sharedPath, diffPath);
    const status = result.diffPercent < 3 ? 'GOOD' : result.diffPercent < 5 ? 'WARN' : 'REVIEW';

    results.push({
      page: pg.name,
      tdsSize: result.tdsSize,
      sharedSize: result.sharedSize,
      diffPixels: result.diffPixels,
      diffPercent: result.diffPercent,
      status,
    });

    console.log(`  ${pg.name}: ${result.diffPercent}% diff (${result.diffPixels.toLocaleString()}px) [${status}]`);
  }

  const avgDiff = results.length > 0
    ? (results.reduce((sum, r) => sum + r.diffPercent, 0) / results.length).toFixed(2)
    : 'N/A';

  const report = [
    '# IAM Visual Regression Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Pages compared: ${results.length}`,
    `Average diff: ${avgDiff}%`,
    '',
    '## Page-by-Page Results',
    '',
    '| Page | TDS Size | shared-v2 Size | Diff Pixels | Diff % | Status |',
    '|------|----------|----------------|-------------|--------|--------|',
    ...results.map(r =>
      `| ${r.page} | ${r.tdsSize} | ${r.sharedSize} | ${r.diffPixels.toLocaleString()} | ${r.diffPercent}% | ${r.status} |`
    ),
    '',
    '## Status Criteria',
    '- **GOOD**: < 3% pixel difference (target achieved)',
    '- **WARN**: 3-5% pixel difference (minor differences)',
    '- **REVIEW**: > 5% pixel difference (requires attention)',
    '',
    '## Files',
    `- TDS screenshots: \`${path.join(OUTPUT_DIR, 'tds')}\``,
    `- shared-v2 screenshots: \`${path.join(OUTPUT_DIR, 'shared-v2')}\``,
    `- Diff images: \`${path.join(OUTPUT_DIR, 'diff')}\``,
  ];

  fs.writeFileSync(path.join(OUTPUT_DIR, 'REPORT.md'), report.join('\n'));
  console.log(`\nReport: ${path.join(OUTPUT_DIR, 'REPORT.md')}`);

  expect(results.length).toBe(IAM_PAGES.length);
});

/* ─── Style-level diff extraction test ─── */

test('IAM style diff: extract computed styles and generate style-diff.json', async ({ browser }) => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allPageReports: PageStyleReport[] = [];

  for (const pg of IAM_PAGES) {
    const tdsContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const sharedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    const tdsPage = await tdsContext.newPage();
    const sharedPage = await sharedContext.newPage();

    await tdsPage.goto(`${TDS_BASE}${pg.path}`, { waitUntil: 'networkidle' });
    await sharedPage.goto(`${SHARED_BASE}${pg.path}`, { waitUntil: 'networkidle' });

    await tdsPage.waitForTimeout(1500);
    await sharedPage.waitForTimeout(1500);

    const diffs: StyleDiff[] = [];

    for (const target of ELEMENT_TARGETS) {
      const tdsStyles = await extractStyles(tdsPage, target.tdsSelector);
      const sharedStyles = await extractStyles(sharedPage, target.sharedSelector);

      if (!tdsStyles && !sharedStyles) continue;

      if (tdsStyles && !sharedStyles) {
        diffs.push({
          element: target.name,
          component: target.component,
          styleFile: target.styleFile,
          property: '__presence',
          tds: 'exists',
          shared: 'missing',
          severity: 'critical',
        });
        continue;
      }

      if (!tdsStyles && sharedStyles) {
        diffs.push({
          element: target.name,
          component: target.component,
          styleFile: target.styleFile,
          property: '__presence',
          tds: 'missing',
          shared: 'exists',
          severity: 'critical',
        });
        continue;
      }

      if (tdsStyles && sharedStyles) {
        const tdsH = parseFloat(tdsStyles['__boundingHeight'] || '0');
        const sharedH = parseFloat(sharedStyles['__boundingHeight'] || '0');
        if (Math.abs(tdsH - sharedH) > 1) {
          diffs.push({
            element: target.name,
            component: target.component,
            styleFile: target.styleFile,
            property: 'boundingHeight',
            tds: `${tdsH}px`,
            shared: `${sharedH}px`,
            severity: Math.abs(tdsH - sharedH) > 8 ? 'critical' : 'major',
          });
        }

        const tdsW = parseFloat(tdsStyles['__boundingWidth'] || '0');
        const sharedW = parseFloat(sharedStyles['__boundingWidth'] || '0');
        if (Math.abs(tdsW - sharedW) > 2) {
          diffs.push({
            element: target.name,
            component: target.component,
            styleFile: target.styleFile,
            property: 'boundingWidth',
            tds: `${tdsW}px`,
            shared: `${sharedW}px`,
            severity: Math.abs(tdsW - sharedW) > 20 ? 'critical' : 'major',
          });
        }

        for (const prop of STYLE_PROPERTIES) {
          const cssProp = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
          const tdsVal = tdsStyles[prop] || '';
          const sharedVal = sharedStyles[prop] || '';

          if (tdsVal === sharedVal) continue;

          const tdsNum = parseFloat(tdsVal);
          const sharedNum = parseFloat(sharedVal);
          if (!isNaN(tdsNum) && !isNaN(sharedNum) && Math.abs(tdsNum - sharedNum) < 1) continue;

          diffs.push({
            element: target.name,
            component: target.component,
            styleFile: target.styleFile,
            property: cssProp,
            tds: tdsVal,
            shared: sharedVal,
            severity: classifySeverity(prop, tdsVal, sharedVal),
          });
        }
      }
    }

    allPageReports.push({
      route: pg.path,
      pageName: pg.name,
      diffs,
    });

    console.log(`  ${pg.name}: ${diffs.length} style diffs found`);

    await tdsContext.close();
    await sharedContext.close();
  }

  const totalDiffs = allPageReports.reduce((sum, r) => sum + r.diffs.length, 0);
  const criticalCount = allPageReports.reduce(
    (sum, r) => sum + r.diffs.filter(d => d.severity === 'critical').length, 0
  );

  const report = {
    generated: new Date().toISOString(),
    summary: {
      pagesCompared: allPageReports.length,
      totalDiffs,
      critical: criticalCount,
      major: allPageReports.reduce((sum, r) => sum + r.diffs.filter(d => d.severity === 'major').length, 0),
      minor: allPageReports.reduce((sum, r) => sum + r.diffs.filter(d => d.severity === 'minor').length, 0),
    },
    componentMapping: {
      TabBar: ['src/components/TabBar/TabBar.styles.ts', 'src/components/TabBar/TabItem.styles.ts'],
      Sidebar: ['src/components/Sidebar/Sidebar.styles.ts'],
      Table: ['src/components/TcTable/'],
      Button: ['src/components/Button/Button.styles.ts'],
      SearchInput: ['src/components/SearchInput/'],
      PageHeader: ['preview layout'],
    },
    pages: allPageReports,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'style-diff.json'),
    JSON.stringify(report, null, 2)
  );

  const mdLines = [
    '# Style Diff Report',
    '',
    `Generated: ${report.generated}`,
    `Total diffs: ${totalDiffs} (critical: ${criticalCount})`,
    '',
  ];

  for (const pageReport of allPageReports) {
    mdLines.push(`## ${pageReport.pageName} (${pageReport.route})`);
    mdLines.push('');
    if (pageReport.diffs.length === 0) {
      mdLines.push('No style differences found.');
    } else {
      mdLines.push('| Element | Property | TDS | shared-v2 | Severity | Style File |');
      mdLines.push('|---------|----------|-----|-----------|----------|------------|');
      for (const d of pageReport.diffs) {
        const tdsShort = d.tds.length > 40 ? d.tds.slice(0, 37) + '...' : d.tds;
        const sharedShort = d.shared.length > 40 ? d.shared.slice(0, 37) + '...' : d.shared;
        mdLines.push(`| ${d.element} | ${d.property} | ${tdsShort} | ${sharedShort} | ${d.severity} | ${d.styleFile} |`);
      }
    }
    mdLines.push('');
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'STYLE-DIFF-REPORT.md'), mdLines.join('\n'));

  console.log(`\nStyle diff report: ${path.join(OUTPUT_DIR, 'style-diff.json')}`);
  console.log(`Markdown report: ${path.join(OUTPUT_DIR, 'STYLE-DIFF-REPORT.md')}`);
  console.log(`Total diffs: ${totalDiffs} (critical: ${criticalCount})`);

  expect(allPageReports.length).toBe(IAM_PAGES.length);
});
