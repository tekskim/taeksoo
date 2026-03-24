import { test, expect, Browser, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TDS_BASE = 'http://localhost:5173';
const SHARED_BASE = 'http://localhost:5174';

const OUTPUT_DIR = path.resolve(__dirname, '../../visual-report-create');

const CREATE_PAGES = [
  { name: 'iam-users-create', path: '/iam/users/create' },
  { name: 'iam-user-groups-create', path: '/iam/user-groups/create' },
  { name: 'iam-roles-create', path: '/iam/roles/create' },
  { name: 'iam-policies-create', path: '/iam/policies/create' },
  { name: 'iam-sysadmin-create', path: '/iam/system-administrators/create' },
  { name: 'st-bucket-create', path: '/storage/buckets/create' },
  { name: 'cb-discovery-create', path: '/cloudbuilder/discovery-rules/create' },
  { name: 'cb-servers-create', path: '/cloudbuilder/servers/create' },
];

/* ─── Style diff config ─── */

const STYLE_PROPERTIES = [
  'width',
  'height',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'gap',
  'rowGap',
  'columnGap',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'color',
  'backgroundColor',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderColor',
  'borderRadius',
  'boxShadow',
] as const;

interface ElementTarget {
  name: string;
  tdsSelector: string;
  sharedSelector: string;
  component: string;
  styleFile: string;
}

const CREATE_ELEMENT_TARGETS: ElementTarget[] = [
  {
    name: 'Page title',
    tdsSelector: 'main h1',
    sharedSelector: 'main h4',
    component: 'CreateLayout',
    styleFile: 'CreateLayout.styles.ts',
  },
  {
    name: 'Section container (first fieldset)',
    tdsSelector: 'main [data-component="section-card"]',
    sharedSelector: 'main fieldset',
    component: 'Fieldset',
    styleFile: 'Fieldset.styles.ts',
  },
  {
    name: 'Section legend/title',
    tdsSelector: 'main [data-component="section-card"] h5',
    sharedSelector: 'main fieldset legend',
    component: 'Fieldset',
    styleFile: 'Fieldset.styles.ts',
  },
  {
    name: 'First text input',
    tdsSelector: 'main input[type="text"]',
    sharedSelector: 'main input[type="text"]',
    component: 'Input',
    styleFile: 'Input.styles.ts',
  },
  {
    name: 'Sidebar outer container',
    tdsSelector: 'main [class*="wizard-summary"]',
    sharedSelector: 'main aside',
    component: 'CreateLayout',
    styleFile: 'CreateLayout.styles.ts',
  },
  {
    name: 'Summary inner card',
    tdsSelector: '[data-figma-name*="Stepper.Summary"]',
    sharedSelector: 'main aside section',
    component: 'FloatingCard',
    styleFile: 'FloatingCard.styles.ts',
  },
  {
    name: 'Cancel button',
    tdsSelector: 'button:has-text("Cancel")',
    sharedSelector: 'button:has-text("Cancel")',
    component: 'Button',
    styleFile: 'Button.styles.ts',
  },
  {
    name: 'Create/Next button',
    tdsSelector: 'button:has-text("Create"), button:has-text("Next")',
    sharedSelector: 'button:has-text("Create"), button:has-text("Next")',
    component: 'Button',
    styleFile: 'Button.styles.ts',
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
}

interface StructureInfo {
  pageName: string;
  route: string;
  tds: {
    hasSidebar: boolean;
    sectionCount: number;
    hasCreateBtn: boolean;
    hasCancelBtn: boolean;
    inputCount: number;
    pageTitle: string | null;
  };
  shared: {
    hasSidebar: boolean;
    fieldsetCount: number;
    hasCreateBtn: boolean;
    hasCancelBtn: boolean;
    inputCount: number;
    pageTitle: string | null;
  };
}

function classifySeverity(
  property: string,
  tdsVal: string,
  sharedVal: string
): 'critical' | 'major' | 'minor' {
  if (property === 'height' || property === 'width') {
    const tdsNum = parseFloat(tdsVal);
    const sharedNum = parseFloat(sharedVal);
    if (!isNaN(tdsNum) && !isNaN(sharedNum) && Math.abs(tdsNum - sharedNum) > 8) return 'critical';
    if (!isNaN(tdsNum) && !isNaN(sharedNum) && Math.abs(tdsNum - sharedNum) > 2) return 'major';
  }
  if (property === 'fontSize' || property === 'fontWeight' || property === 'lineHeight')
    return 'major';
  if (property.startsWith('padding') || property.startsWith('margin') || property === 'gap')
    return 'major';
  if (property === 'backgroundColor' || property === 'color') return 'minor';
  if (property.startsWith('border')) return 'minor';
  return 'minor';
}

async function extractStyles(page: Page, selector: string): Promise<Record<string, string> | null> {
  try {
    const el = page.locator(selector).first();
    if (!(await el.count())) return null;
    return await el.evaluate(
      (node, props) => {
        const cs = window.getComputedStyle(node);
        const result: Record<string, string> = {};
        for (const p of props) {
          result[p] = cs.getPropertyValue(p.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`));
        }
        result['__boundingHeight'] = String(node.getBoundingClientRect().height);
        result['__boundingWidth'] = String(node.getBoundingClientRect().width);
        return result;
      },
      [...STYLE_PROPERTIES]
    );
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

async function extractStructure(page: Page, variant: 'tds' | 'shared') {
  return await page.evaluate((v) => {
    const main = document.querySelector('main') || document.body;
    if (v === 'tds') {
      const sidebar = main.querySelector('[class*="wizard-summary"]');
      const sections = main.querySelectorAll('[data-component="section-card"]');
      const createBtn = main.querySelector('button')
        ? Array.from(main.querySelectorAll('button')).find(
            (b) => b.textContent?.trim() === 'Create'
          )
        : null;
      const cancelBtn = main.querySelector('button')
        ? Array.from(main.querySelectorAll('button')).find(
            (b) => b.textContent?.trim() === 'Cancel'
          )
        : null;
      const inputs = main.querySelectorAll('input[type="text"], input:not([type])');
      const h1 = main.querySelector('h1');
      return {
        hasSidebar: !!sidebar,
        sectionCount: sections.length,
        hasCreateBtn: !!createBtn,
        hasCancelBtn: !!cancelBtn,
        inputCount: inputs.length,
        pageTitle: h1?.textContent?.trim() || null,
      };
    } else {
      const sidebar = main.querySelector('aside');
      const fieldsets = main.querySelectorAll('fieldset');
      const createBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Create'
      );
      const cancelBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Cancel'
      );
      const inputs = main.querySelectorAll('input[type="text"], input:not([type])');
      const h4 = main.querySelector('h4');
      return {
        hasSidebar: !!sidebar,
        fieldsetCount: fieldsets.length,
        hasCreateBtn: !!createBtn,
        hasCancelBtn: !!cancelBtn,
        inputCount: inputs.length,
        pageTitle: h4?.textContent?.trim() || null,
      };
    }
  }, variant);
}

/* ─── Test 1: Pixel diff ─── */

test('Create pages: pixel diff comparison', async ({ browser }) => {
  fs.mkdirSync(path.join(OUTPUT_DIR, 'tds'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'shared-v2'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'diff'), { recursive: true });

  const results: Array<{
    page: string;
    route: string;
    tdsSize: string;
    sharedSize: string;
    diffPixels: number;
    diffPercent: number;
    status: string;
  }> = [];

  for (const pg of CREATE_PAGES) {
    const tdsPath = path.join(OUTPUT_DIR, 'tds', `${pg.name}.png`);
    const sharedPath = path.join(OUTPUT_DIR, 'shared-v2', `${pg.name}.png`);
    const diffPath = path.join(OUTPUT_DIR, 'diff', `${pg.name}-diff.png`);

    await captureFullPage(browser, `${TDS_BASE}${pg.path}`, tdsPath);
    await captureFullPage(browser, `${SHARED_BASE}${pg.path}`, sharedPath);

    const result = comparePNGs(tdsPath, sharedPath, diffPath);
    const status = result.diffPercent < 5 ? 'GOOD' : result.diffPercent < 10 ? 'WARN' : 'REVIEW';

    results.push({
      page: pg.name,
      route: pg.path,
      tdsSize: result.tdsSize,
      sharedSize: result.sharedSize,
      diffPixels: result.diffPixels,
      diffPercent: result.diffPercent,
      status,
    });

    console.log(
      `  ${pg.name}: ${result.diffPercent}% diff (${result.diffPixels.toLocaleString()}px) [${status}]`
    );
  }

  const avgDiff =
    results.length > 0
      ? (results.reduce((sum, r) => sum + r.diffPercent, 0) / results.length).toFixed(2)
      : 'N/A';

  const goodCount = results.filter((r) => r.status === 'GOOD').length;
  const warnCount = results.filter((r) => r.status === 'WARN').length;
  const reviewCount = results.filter((r) => r.status === 'REVIEW').length;

  const report = [
    '# Create Pages Visual Regression Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Pages compared: ${results.length}`,
    `Average diff: ${avgDiff}%`,
    `GOOD: ${goodCount} | WARN: ${warnCount} | REVIEW: ${reviewCount}`,
    '',
    '## Page-by-Page Results',
    '',
    '| Page | Route | TDS Size | shared-v2 Size | Diff Pixels | Diff % | Status |',
    '|------|-------|----------|----------------|-------------|--------|--------|',
    ...results.map(
      (r) =>
        `| ${r.page} | ${r.route} | ${r.tdsSize} | ${r.sharedSize} | ${r.diffPixels.toLocaleString()} | ${r.diffPercent}% | ${r.status} |`
    ),
    '',
    '## Status Criteria',
    '- **GOOD**: < 5% pixel difference',
    '- **WARN**: 5-10% pixel difference',
    '- **REVIEW**: > 10% pixel difference (requires attention)',
    '',
    '## Files',
    `- TDS screenshots: \`${path.join(OUTPUT_DIR, 'tds')}\``,
    `- shared-v2 screenshots: \`${path.join(OUTPUT_DIR, 'shared-v2')}\``,
    `- Diff images: \`${path.join(OUTPUT_DIR, 'diff')}\``,
  ];

  fs.writeFileSync(path.join(OUTPUT_DIR, 'REPORT.md'), report.join('\n'));
  console.log(`\nPixel diff report: ${path.join(OUTPUT_DIR, 'REPORT.md')}`);

  expect(results.length).toBe(CREATE_PAGES.length);
});

/* ─── Test 2: Style diff ─── */

test('Create pages: style diff extraction', async ({ browser }) => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allPageReports: PageStyleReport[] = [];

  for (const pg of CREATE_PAGES) {
    const tdsContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const sharedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    const tdsPage = await tdsContext.newPage();
    const sharedPage = await sharedContext.newPage();

    await tdsPage.goto(`${TDS_BASE}${pg.path}`, { waitUntil: 'networkidle' });
    await sharedPage.goto(`${SHARED_BASE}${pg.path}`, { waitUntil: 'networkidle' });

    await tdsPage.waitForTimeout(1500);
    await sharedPage.waitForTimeout(1500);

    const diffs: StyleDiff[] = [];

    for (const target of CREATE_ELEMENT_TARGETS) {
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
            property: prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
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
    (sum, r) => sum + r.diffs.filter((d) => d.severity === 'critical').length,
    0
  );
  const majorCount = allPageReports.reduce(
    (sum, r) => sum + r.diffs.filter((d) => d.severity === 'major').length,
    0
  );

  const jsonReport = {
    generated: new Date().toISOString(),
    summary: {
      pagesCompared: allPageReports.length,
      totalDiffs,
      critical: criticalCount,
      major: majorCount,
      minor: totalDiffs - criticalCount - majorCount,
    },
    pages: allPageReports,
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'style-diff.json'), JSON.stringify(jsonReport, null, 2));

  const mdLines = [
    '# Create Pages Style Diff Report',
    '',
    `Generated: ${jsonReport.generated}`,
    `Total diffs: ${totalDiffs} (critical: ${criticalCount}, major: ${majorCount})`,
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
        mdLines.push(
          `| ${d.element} | ${d.property} | ${tdsShort} | ${sharedShort} | ${d.severity} | ${d.styleFile} |`
        );
      }
    }
    mdLines.push('');
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'STYLE-DIFF-REPORT.md'), mdLines.join('\n'));

  console.log(`\nStyle diff JSON: ${path.join(OUTPUT_DIR, 'style-diff.json')}`);
  console.log(`Style diff MD: ${path.join(OUTPUT_DIR, 'STYLE-DIFF-REPORT.md')}`);
  console.log(`Total diffs: ${totalDiffs} (critical: ${criticalCount})`);

  expect(allPageReports.length).toBe(CREATE_PAGES.length);
});

/* ─── Test 3: Layout structure ─── */

test('Create pages: layout structure comparison', async ({ browser }) => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const allStructures: StructureInfo[] = [];

  for (const pg of CREATE_PAGES) {
    const tdsContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const sharedContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    const tdsPage = await tdsContext.newPage();
    const sharedPage = await sharedContext.newPage();

    await tdsPage.goto(`${TDS_BASE}${pg.path}`, { waitUntil: 'networkidle' });
    await sharedPage.goto(`${SHARED_BASE}${pg.path}`, { waitUntil: 'networkidle' });

    await tdsPage.waitForTimeout(1500);
    await sharedPage.waitForTimeout(1500);

    const tdsStructure = await extractStructure(tdsPage, 'tds');
    const sharedStructure = await extractStructure(sharedPage, 'shared');

    allStructures.push({
      pageName: pg.name,
      route: pg.path,
      tds: tdsStructure as StructureInfo['tds'],
      shared: sharedStructure as StructureInfo['shared'],
    });

    console.log(
      `  ${pg.name}: TDS(sidebar=${tdsStructure.hasSidebar}, sections=${tdsStructure.sectionCount}) ` +
        `shared(sidebar=${sharedStructure.hasSidebar}, fieldsets=${sharedStructure.fieldsetCount})`
    );

    await tdsContext.close();
    await sharedContext.close();
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'structure-report.json'),
    JSON.stringify(allStructures, null, 2)
  );

  const mdLines = [
    '# Create Pages Structure Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Pages compared: ${allStructures.length}`,
    '',
    '## Structure Comparison',
    '',
    '| Page | TDS Sidebar | TDS Sections | Shared Sidebar | Shared Fieldsets | TDS Title | Shared Title |',
    '|------|-------------|--------------|----------------|------------------|-----------|--------------|',
    ...allStructures.map(
      (s) =>
        `| ${s.pageName} | ${s.tds.hasSidebar} | ${s.tds.sectionCount} | ${s.shared.hasSidebar} | ${s.shared.fieldsetCount} | ${s.tds.pageTitle || '-'} | ${s.shared.pageTitle || '-'} |`
    ),
    '',
    '## Detail',
    '',
  ];

  for (const s of allStructures) {
    mdLines.push(`### ${s.pageName} (${s.route})`);
    mdLines.push('');
    mdLines.push('| Property | TDS | shared-v2 | Match |');
    mdLines.push('|----------|-----|-----------|-------|');
    mdLines.push(
      `| Sidebar | ${s.tds.hasSidebar} | ${s.shared.hasSidebar} | ${s.tds.hasSidebar === s.shared.hasSidebar ? 'YES' : 'NO'} |`
    );
    mdLines.push(
      `| Cancel button | ${s.tds.hasCancelBtn} | ${s.shared.hasCancelBtn} | ${s.tds.hasCancelBtn === s.shared.hasCancelBtn ? 'YES' : 'NO'} |`
    );
    mdLines.push(
      `| Create button | ${s.tds.hasCreateBtn} | ${s.shared.hasCreateBtn} | ${s.tds.hasCreateBtn === s.shared.hasCreateBtn ? 'YES' : 'NO'} |`
    );
    mdLines.push(
      `| Input count | ${s.tds.inputCount} | ${s.shared.inputCount} | ${s.tds.inputCount === s.shared.inputCount ? 'YES' : 'NO'} |`
    );
    mdLines.push(
      `| Page title | ${s.tds.pageTitle || '-'} | ${s.shared.pageTitle || '-'} | ${s.tds.pageTitle === s.shared.pageTitle ? 'YES' : 'NO'} |`
    );
    mdLines.push('');
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'STRUCTURE-REPORT.md'), mdLines.join('\n'));

  console.log(`\nStructure report: ${path.join(OUTPUT_DIR, 'structure-report.json')}`);
  console.log(`Structure MD: ${path.join(OUTPUT_DIR, 'STRUCTURE-REPORT.md')}`);

  expect(allStructures.length).toBe(CREATE_PAGES.length);
});
