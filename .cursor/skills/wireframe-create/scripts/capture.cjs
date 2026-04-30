/**
 * wireframe-create/scripts/capture.cjs
 *
 * 매니페스트 기반 Puppeteer 캡처 스크립트.
 * 각 화면을 2x 해상도로 캡처하고 어노테이션 요소의 DOM 좌표를 수집한다.
 *
 * 사용법:
 *   cd /workspace
 *   node .cursor/skills/wireframe-create/scripts/capture.cjs \
 *     --manifest .cursor/skills/wireframe-create/manifests/desktop-ui.yaml \
 *     --out /tmp/wf_captures/
 *     [--screens HOME01,LAUNCHER01]   # 특정 화면만 캡처 (선택)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ─── CLI 파싱 ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const manifestPath = getArg('--manifest');
const outDir = getArg('--out') || '/tmp/wf_captures/';
const screensFilter = getArg('--screens')?.split(',') || null;

if (!manifestPath) {
  console.error('Usage: node capture.cjs --manifest <path> [--out <dir>] [--screens ID1,ID2]');
  process.exit(1);
}

// ─── yaml 로드 ────────────────────────────────────────────────────────────
// js-yaml가 없으면 간단한 파서로 대체
let manifest;
try {
  manifest = yaml.load(fs.readFileSync(manifestPath, 'utf8'));
} catch (e) {
  // js-yaml 없음 — JSON fallback (yaml과 동일 구조인 경우)
  console.warn('js-yaml not found, trying JSON fallback...');
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e2) {
    console.error('Failed to parse manifest:', e2.message);
    process.exit(1);
  }
}

fs.mkdirSync(outDir, { recursive: true });

const { capture, screens, image_area } = manifest;
const BASE_URL = capture.baseUrl;
const VP = capture.viewport;

// ─── 헬퍼: DOM 요소 좌표 수집 ────────────────────────────────────────────
async function getRect(page, selector) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x), y: Math.round(r.y),
      w: Math.round(r.width), h: Math.round(r.height),
      cx: Math.round(r.x + r.width / 2),
      cy: Math.round(r.y + r.height / 2),
    };
  }, selector);
}

// ─── 헬퍼: DOM 좌표 → Figma 좌표 변환 ───────────────────────────────────
function toFigma(dom_x, dom_y, ia) {
  return {
    x: Math.round(ia.x + dom_x * (ia.w / ia.dom_w)),
    y: Math.round(ia.y + dom_y * (ia.h / ia.dom_h)),
  };
}

// ─── 헬퍼: setup 액션 실행 ───────────────────────────────────────────────
async function runSetup(page, actions) {
  for (const action of (actions || [])) {
    switch (action.type) {
      case 'wait':
        await new Promise(r => setTimeout(r, action.ms));
        break;
      case 'click':
        try {
          await page.click(action.selector);
        } catch (e) {
          console.warn(`  [setup] click failed: ${action.selector}`);
        }
        break;
      case 'right_click':
        try {
          const el = await page.$(action.selector);
          if (el) {
            const box = await el.boundingBox();
            if (box) await page.mouse.click(
              box.x + box.width / 2,
              box.y + box.height / 2,
              { button: 'right' }
            );
          }
        } catch (e) {
          console.warn(`  [setup] right_click failed: ${action.selector}`);
        }
        break;
      case 'dblclick_selector':
        try {
          const el = await page.$(action.selector);
          if (el) {
            const box = await el.boundingBox();
            if (box) await page.mouse.click(
              box.x + box.width / 2,
              box.y + box.height / 2,
              { clickCount: 2 }
            );
          }
        } catch (e) {
          console.warn(`  [setup] dblclick failed: ${action.selector}`);
        }
        break;
      case 'click_text':
        try {
          await page.evaluate((text) => {
            const btns = Array.from(document.querySelectorAll('button'));
            const b = btns.find(el => el.textContent.trim() === text);
            if (b) b.click();
          }, action.text);
        } catch (e) {
          console.warn(`  [setup] click_text failed: ${action.text}`);
        }
        break;
      case 'click_aria_label':
        try {
          await page.evaluate((label) => {
            const el = document.querySelector(`[aria-label="${label}"]`);
            if (el) el.click();
          }, action.label);
        } catch (e) {
          console.warn(`  [setup] click_aria_label failed: ${action.label}`);
        }
        break;
    }
  }
}

// ─── 메인 ─────────────────────────────────────────────────────────────────
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu',
           `--window-size=${VP.width},${VP.height}`],
  });

  const allRects = {};
  const ia = image_area;

  const targetScreens = screensFilter
    ? screens.filter(s => screensFilter.includes(s.id))
    : screens;

  for (const screen of targetScreens) {
    console.log(`\n[${screen.id}] ${screen.name}`);

    const page = await browser.newPage();
    await page.setViewport({
      width: VP.width,
      height: VP.height,
      deviceScaleFactor: VP.deviceScaleFactor,
    });

    const errors = [];
    page.on('pageerror', e => errors.push(e.message.slice(0, 80)));

    const url = BASE_URL + screen.url;
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 });

    // Setup actions
    await runSetup(page, screen.setup);

    // Screenshot
    const screenshotPath = path.join(outDir, `${screen.id}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`  ✓ Screenshot → ${screenshotPath}`);

    // Collect annotation rects
    const rects = {};
    for (const ann of (screen.annotations || [])) {
      if (ann.selector) {
        const rect = await getRect(page, ann.selector);
        if (rect) {
          rects[ann.label] = {
            dom: rect,
            figma: toFigma(rect.cx, rect.cy, ia),
          };
          console.log(`  ✓ [${ann.label}] ${ann.selector} → dom(${rect.cx},${rect.cy}) figma(${rects[ann.label].figma.x},${rects[ann.label].figma.y})`);
        } else {
          console.warn(`  ⚠ [${ann.label}] selector not found: ${ann.selector}`);
          // Fallback to position if provided
          if (ann.position) {
            rects[ann.label] = {
              dom: ann.position,
              figma: toFigma(ann.position.x, ann.position.y, ia),
            };
          }
        }
      } else if (ann.position) {
        rects[ann.label] = {
          dom: ann.position,
          figma: toFigma(ann.position.x, ann.position.y, ia),
        };
        console.log(`  ✓ [${ann.label}] position(${ann.position.x},${ann.position.y}) → figma(${rects[ann.label].figma.x},${rects[ann.label].figma.y})`);
      }
    }

    allRects[screen.id] = {
      rects,
      errors: errors.slice(0, 2),
      screenshotPath,
    };

    await page.close();
  }

  await browser.close();

  // Save rects
  const rectsPath = path.join(outDir, 'rects.json');
  fs.writeFileSync(rectsPath, JSON.stringify(allRects, null, 2));
  console.log(`\n✓ Rects saved → ${rectsPath}`);

  // Summary
  console.log('\n─── Capture Summary ───');
  for (const [id, data] of Object.entries(allRects)) {
    const annCount = Object.keys(data.rects).length;
    const errCount = data.errors.length;
    console.log(`  ${id}: ${annCount} annotations${errCount ? `, ${errCount} errors` : ''}`);
  }
})();
