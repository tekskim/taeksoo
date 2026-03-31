import { test, expect, Browser } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TDS_BASE = 'http://localhost:5173';
const SHARED_BASE = 'http://localhost:5174';

const OUTPUT_DIR = path.resolve(__dirname, '../../visual-report-compute-admin');

const COMPUTE_ADMIN_PAGES = [
  // Home
  { name: 'ca-home', path: '/compute-admin', type: 'special' },

  // Compute — List
  { name: 'ca-instances-list', path: '/compute-admin/instances', type: 'list' },
  { name: 'ca-instance-templates-list', path: '/compute-admin/instance-templates', type: 'list' },
  { name: 'ca-instance-snapshots-list', path: '/compute-admin/instance-snapshots', type: 'list' },
  { name: 'ca-images-list', path: '/compute-admin/images', type: 'list' },
  { name: 'ca-flavors-list', path: '/compute-admin/flavors', type: 'list' },
  { name: 'ca-server-groups-list', path: '/compute-admin/server-groups', type: 'list' },
  { name: 'ca-host-aggregates-list', path: '/compute-admin/host-aggregates', type: 'list' },
  { name: 'ca-bare-metal-nodes-list', path: '/compute-admin/bare-metal-nodes', type: 'list' },

  // Compute — Detail
  { name: 'ca-instance-detail', path: '/compute-admin/instances/vm-001', type: 'detail' },
  {
    name: 'ca-instance-template-detail',
    path: '/compute-admin/instance-templates/tpl-001',
    type: 'detail',
  },
  {
    name: 'ca-instance-snapshot-detail',
    path: '/compute-admin/instance-snapshots/isnap-001',
    type: 'detail',
  },
  { name: 'ca-image-detail', path: '/compute-admin/images/img-001', type: 'detail' },
  { name: 'ca-flavor-detail', path: '/compute-admin/flavors/flv-001', type: 'detail' },
  { name: 'ca-server-group-detail', path: '/compute-admin/server-groups/sg-001', type: 'detail' },
  {
    name: 'ca-bare-metal-detail',
    path: '/compute-admin/bare-metal-nodes/bm-001',
    type: 'detail',
  },

  // Compute — Create
  { name: 'ca-instance-create', path: '/compute-admin/instances/create', type: 'create' },
  {
    name: 'ca-instance-template-create',
    path: '/compute-admin/instance-templates/create',
    type: 'create',
  },
  { name: 'ca-image-create', path: '/compute-admin/images/create', type: 'create' },
  { name: 'ca-flavor-create', path: '/compute-admin/flavors/create', type: 'create' },

  // Storage — List
  { name: 'ca-volumes-list', path: '/compute-admin/volumes', type: 'list' },
  { name: 'ca-volume-snapshots-list', path: '/compute-admin/volume-snapshots', type: 'list' },
  { name: 'ca-volume-backups-list', path: '/compute-admin/volume-backups', type: 'list' },
  { name: 'ca-volume-types-list', path: '/compute-admin/volume-types', type: 'list' },

  // Storage — Detail
  { name: 'ca-volume-detail', path: '/compute-admin/volumes/vol-001', type: 'detail' },
  {
    name: 'ca-volume-snapshot-detail',
    path: '/compute-admin/volume-snapshots/vsnap-001',
    type: 'detail',
  },
  {
    name: 'ca-volume-backup-detail',
    path: '/compute-admin/volume-backups/vbak-001',
    type: 'detail',
  },
  {
    name: 'ca-volume-type-detail',
    path: '/compute-admin/volume-types/vt-001',
    type: 'detail',
  },
  { name: 'ca-qos-spec-detail', path: '/compute-admin/qos-specs/qs-001', type: 'detail' },

  // Network — List
  { name: 'ca-networks-list', path: '/compute-admin/networks', type: 'list' },
  { name: 'ca-routers-list', path: '/compute-admin/routers', type: 'list' },
  { name: 'ca-ports-list', path: '/compute-admin/ports', type: 'list' },
  { name: 'ca-floating-ips-list', path: '/compute-admin/floating-ips', type: 'list' },
  { name: 'ca-security-groups-list', path: '/compute-admin/security-groups', type: 'list' },
  { name: 'ca-load-balancers-list', path: '/compute-admin/load-balancers', type: 'list' },
  { name: 'ca-firewalls-list', path: '/compute-admin/firewall', type: 'list' },
  { name: 'ca-certificates-list', path: '/compute-admin/certificates', type: 'list' },

  // Network — Detail
  { name: 'ca-network-detail', path: '/compute-admin/networks/net-001', type: 'detail' },
  { name: 'ca-subnet-detail', path: '/compute-admin/subnets/subnet-001', type: 'detail' },
  { name: 'ca-router-detail', path: '/compute-admin/routers/rtr-001', type: 'detail' },
  { name: 'ca-port-detail', path: '/compute-admin/ports/port-001', type: 'detail' },
  { name: 'ca-floating-ip-detail', path: '/compute-admin/floating-ips/fip-001', type: 'detail' },
  {
    name: 'ca-security-group-detail',
    path: '/compute-admin/security-groups/sg-001',
    type: 'detail',
  },
  {
    name: 'ca-load-balancer-detail',
    path: '/compute-admin/load-balancers/lb-001',
    type: 'detail',
  },
  { name: 'ca-listener-detail', path: '/compute-admin/listeners/lsnr-001', type: 'detail' },
  { name: 'ca-pool-detail', path: '/compute-admin/pools/pool-001', type: 'detail' },
  { name: 'ca-l7-policy-detail', path: '/compute-admin/l7-policies/l7p-001', type: 'detail' },
  { name: 'ca-firewall-detail', path: '/compute-admin/firewalls/fw-001', type: 'detail' },
  {
    name: 'ca-firewall-policy-detail',
    path: '/compute-admin/firewall-policies/fwp-001',
    type: 'detail',
  },
  {
    name: 'ca-firewall-rule-detail',
    path: '/compute-admin/firewall-rules/fwr-001',
    type: 'detail',
  },
  {
    name: 'ca-certificate-detail',
    path: '/compute-admin/certificates/cert-001',
    type: 'detail',
  },

  // Network — Create
  { name: 'ca-network-create', path: '/compute-admin/networks/create', type: 'create' },
  {
    name: 'ca-firewall-rule-create',
    path: '/compute-admin/firewall/create-rule',
    type: 'create',
  },

  // System — List
  { name: 'ca-tenants-list', path: '/compute-admin/tenants', type: 'list' },
  {
    name: 'ca-metadata-definitions-list',
    path: '/compute-admin/metadata-definition',
    type: 'list',
  },

  // System — Detail
  { name: 'ca-tenant-detail', path: '/compute-admin/tenants/tenant-001', type: 'detail' },
  {
    name: 'ca-metadata-definition-detail',
    path: '/compute-admin/metadata-definition/md-001',
    type: 'detail',
  },

  // Monitoring
  { name: 'ca-monitor-overview', path: '/compute-admin/monitor-overview', type: 'special' },
  { name: 'ca-physical-nodes-list', path: '/compute-admin/physical-nodes', type: 'list' },

  // Special
  { name: 'ca-topology', path: '/compute-admin/topology', type: 'special' },
  { name: 'ca-console', path: '/compute-admin/console/vm-001', type: 'special' },
];

async function captureFullPage(browser: Browser, url: string, outputPath: string) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await page.waitForTimeout(1200);
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

/* ─── Test 1: Content check (shared-v2 only) ─── */

test('Compute Admin content check: verify all pages render with correct components', async ({
  browser,
}) => {
  test.setTimeout(1200_000);

  const screenshotDir = path.join(OUTPUT_DIR, 'screenshots');
  fs.mkdirSync(screenshotDir, { recursive: true });

  let context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  let page = await context.newPage();

  const jsErrors: string[] = [];
  page.on('pageerror', (err) => jsErrors.push(err.message));

  async function resetContext() {
    try {
      await context.close();
    } catch {
      /* ignore */
    }
    context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    page = await context.newPage();
    jsErrors.length = 0;
    page.on('pageerror', (err) => jsErrors.push(err.message));
  }

  const results: Array<{
    page: string;
    route: string;
    type: string;
    status: 'PASS' | 'FAIL';
    checks: string[];
    errors: string[];
  }> = [];

  async function checkPage(
    pg: (typeof COMPUTE_ADMIN_PAGES)[number]
  ): Promise<{ checks: string[]; errors: string[] }> {
    const errors: string[] = [];
    const checks: string[] = [];
    jsErrors.length = 0;

    await page.goto(`${SHARED_BASE}${pg.path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });
    await page.waitForTimeout(800);

    const hasSidebar = (await page.locator('aside').count()) > 0;
    checks.push(hasSidebar ? 'Sidebar: present' : 'Sidebar: MISSING');

    const hasTabBar = (await page.locator('[role="tab"], .bg-surface.h-9').count()) > 0;
    checks.push(hasTabBar ? 'TabBar: present' : 'TabBar: MISSING');

    const hasToolBar =
      (await page.locator('nav[aria-label="Breadcrumb"], [class*="breadcrumb"]').count()) > 0;
    checks.push(hasToolBar ? 'Breadcrumb: present' : 'Breadcrumb: not found');

    if (pg.type === 'list') {
      const hasTitle = (await page.locator('main h2, main h1').count()) > 0;
      checks.push(hasTitle ? 'Title: present' : 'Title: MISSING');

      const hasTable = (await page.locator('main table').count()) > 0;
      checks.push(hasTable ? 'Table: present' : 'Table: MISSING');

      const hasPagination =
        (await page.locator('[aria-label*="Page"], [class*="pagination"]').count()) > 0;
      checks.push(hasPagination ? 'Pagination: present' : 'Pagination: not found');

      const hasSearch =
        (await page
          .locator('main input[placeholder*="Search"], main input[placeholder*="search"]')
          .count()) > 0;
      checks.push(hasSearch ? 'Search: present' : 'Search: not found');
    }

    if (pg.type === 'detail') {
      const hasHeader =
        (await page.locator('main h2, main h1, [class*="detail-header"]').count()) > 0;
      checks.push(hasHeader ? 'Detail header: present' : 'Detail header: MISSING');

      const hasTabs = (await page.locator('[role="tablist"], [role="tab"]').count()) > 0;
      checks.push(hasTabs ? 'Tabs: present' : 'Tabs: not found');
    }

    if (pg.type === 'create') {
      const hasTitle = (await page.locator('main h2, main h1, main h4').count()) > 0;
      checks.push(hasTitle ? 'Title: present' : 'Title: MISSING');

      const hasForm = (await page.locator('main input, main select, main textarea').count()) > 0;
      checks.push(hasForm ? 'Form inputs: present' : 'Form inputs: MISSING');

      const hasButtons = (await page.locator('main button').count()) > 0;
      checks.push(hasButtons ? 'Buttons: present' : 'Buttons: MISSING');
    }

    if (pg.type === 'special') {
      const mainContent = await page.locator('main').first().textContent();
      const hasContent = mainContent && mainContent.trim().length > 20;
      checks.push(hasContent ? 'Content: present' : 'Content: MISSING');
    }

    const mainContent = await page.locator('main').first().textContent();
    const isEmpty = !mainContent || mainContent.trim().length < 10;
    if (isEmpty) errors.push('Main content is empty or too short');

    if (jsErrors.length > 0) {
      errors.push(...jsErrors.map((e) => `JS Error: ${e}`));
    }

    await page.screenshot({
      path: path.join(screenshotDir, `${pg.name}.png`),
      fullPage: false,
    });

    return { checks, errors };
  }

  for (const pg of COMPUTE_ADMIN_PAGES) {
    let checks: string[] = [];
    let errors: string[] = [];

    try {
      const result = await Promise.race([
        checkPage(pg),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Page check timeout (30s)')), 30000)
        ),
      ]);
      checks = result.checks;
      errors = result.errors;
    } catch (err) {
      errors.push(`Navigation error: ${(err as Error).message}`);
      await resetContext();
    }

    const hasCriticalMissing = checks.some((c) => c.includes('MISSING'));
    const hasJsErrors = errors.length > 0;
    const status = hasCriticalMissing || hasJsErrors ? 'FAIL' : 'PASS';

    results.push({ page: pg.name, route: pg.path, type: pg.type, status, checks, errors });
    console.log(`  ${pg.name}: ${status} (${checks.length} checks, ${errors.length} errors)`);
  }

  try {
    await context.close();
  } catch {
    /* ignore */
  }

  const passCount = results.filter((r) => r.status === 'PASS').length;
  const failCount = results.filter((r) => r.status === 'FAIL').length;

  const report = [
    '# Compute Admin Content & Design Check Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Pages tested: ${results.length}`,
    `PASS: ${passCount} | FAIL: ${failCount}`,
    '',
    '## Summary by Type',
    '',
    `| Type | Total | PASS | FAIL |`,
    `|------|-------|------|------|`,
    ...['list', 'detail', 'create', 'special'].map((type) => {
      const ofType = results.filter((r) => r.type === type);
      return `| ${type} | ${ofType.length} | ${ofType.filter((r) => r.status === 'PASS').length} | ${ofType.filter((r) => r.status === 'FAIL').length} |`;
    }),
    '',
    '## Page-by-Page Results',
    '',
  ];

  for (const r of results) {
    report.push(`### ${r.page} (\`${r.route}\`) [${r.type}] - **${r.status}**`);
    report.push('');
    if (r.checks.length > 0) {
      report.push('**Component checks:**');
      for (const c of r.checks) report.push(`- ${c}`);
      report.push('');
    }
    if (r.errors.length > 0) {
      report.push('**Errors:**');
      for (const e of r.errors) report.push(`- ${e}`);
      report.push('');
    }
  }

  report.push('## Screenshots');
  report.push(`All screenshots saved to: \`${screenshotDir}\``);

  fs.writeFileSync(path.join(OUTPUT_DIR, 'CONTENT-CHECK-REPORT.md'), report.join('\n'));
  console.log(`\nReport: ${path.join(OUTPUT_DIR, 'CONTENT-CHECK-REPORT.md')}`);
  console.log(`PASS: ${passCount}/${results.length}, FAIL: ${failCount}/${results.length}`);

  expect(failCount).toBeLessThan(results.length * 0.3);
});

/* ─── Test 2: Pixel diff (TDS vs shared-v2) ─── */

test('Compute Admin visual regression: capture + compare all pages', async ({ browser }) => {
  test.setTimeout(1200_000);

  fs.mkdirSync(path.join(OUTPUT_DIR, 'tds'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'shared-v2'), { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, 'diff'), { recursive: true });

  const results: Array<{
    page: string;
    route: string;
    type: string;
    tdsSize: string;
    sharedSize: string;
    diffPixels: number;
    diffPercent: number;
    status: string;
  }> = [];

  for (const pg of COMPUTE_ADMIN_PAGES) {
    const tdsImgPath = path.join(OUTPUT_DIR, 'tds', `${pg.name}.png`);
    const sharedImgPath = path.join(OUTPUT_DIR, 'shared-v2', `${pg.name}.png`);
    const diffImgPath = path.join(OUTPUT_DIR, 'diff', `${pg.name}-diff.png`);

    await captureFullPage(browser, `${TDS_BASE}${pg.path}`, tdsImgPath);
    await captureFullPage(browser, `${SHARED_BASE}${pg.path}`, sharedImgPath);

    const result = comparePNGs(tdsImgPath, sharedImgPath, diffImgPath);
    const status = result.diffPercent < 5 ? 'GOOD' : result.diffPercent < 10 ? 'WARN' : 'REVIEW';

    results.push({
      page: pg.name,
      route: pg.path,
      type: pg.type,
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
    '# Compute Admin Visual Regression Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Pages compared: ${results.length}`,
    `Average diff: ${avgDiff}%`,
    `GOOD: ${goodCount} | WARN: ${warnCount} | REVIEW: ${reviewCount}`,
    '',
    '## Summary by Type',
    '',
    '| Type | Total | GOOD | WARN | REVIEW | Avg Diff |',
    '|------|-------|------|------|--------|----------|',
    ...['list', 'detail', 'create', 'special'].map((type) => {
      const ofType = results.filter((r) => r.type === type);
      const typeAvg =
        ofType.length > 0
          ? (ofType.reduce((s, r) => s + r.diffPercent, 0) / ofType.length).toFixed(2)
          : 'N/A';
      return `| ${type} | ${ofType.length} | ${ofType.filter((r) => r.status === 'GOOD').length} | ${ofType.filter((r) => r.status === 'WARN').length} | ${ofType.filter((r) => r.status === 'REVIEW').length} | ${typeAvg}% |`;
    }),
    '',
    '## Page-by-Page Results',
    '',
    '| Page | Route | Type | TDS Size | shared-v2 Size | Diff Pixels | Diff % | Status |',
    '|------|-------|------|----------|----------------|-------------|--------|--------|',
    ...results.map(
      (r) =>
        `| ${r.page} | ${r.route} | ${r.type} | ${r.tdsSize} | ${r.sharedSize} | ${r.diffPixels.toLocaleString()} | ${r.diffPercent}% | ${r.status} |`
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
  console.log(`\nReport: ${path.join(OUTPUT_DIR, 'REPORT.md')}`);

  expect(results.length).toBe(COMPUTE_ADMIN_PAGES.length);
});
