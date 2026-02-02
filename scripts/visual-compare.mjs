#!/usr/bin/env node
/**
 * Visual Comparison Tool
 * tds와 thaki-ui 컴포넌트의 시각적 차이를 비교합니다.
 * 
 * 사용법:
 *   node scripts/visual-compare.mjs --tds http://localhost:5173/design --thaki http://localhost:6006
 *   node scripts/visual-compare.mjs --component Button
 *   node scripts/visual-compare.mjs --all
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../visual-diff-output');

// 비교할 컴포넌트 목록과 경로 매핑
const COMPONENT_MAP = {
  Button: {
    tds: '/design#button',
    thaki: '/iframe.html?id=components-button--default',
    selector: '[data-component="button"]' // 선택적
  },
  Input: {
    tds: '/design#input',
    thaki: '/iframe.html?id=components-input--default',
  },
  Checkbox: {
    tds: '/design#checkbox',
    thaki: '/iframe.html?id=components-checkbox--default',
  },
  Toggle: {
    tds: '/design#toggle',
    thaki: '/iframe.html?id=components-toggle--default',
  },
  Select: {
    tds: '/design#select',
    thaki: '/iframe.html?id=components-select--default',
  },
  Badge: {
    tds: '/design#badge',
    thaki: '/iframe.html?id=components-badge--default',
  },
  Modal: {
    tds: '/design#modal',
    thaki: '/iframe.html?id=components-modal--default',
  },
  Table: {
    tds: '/design#table',
    thaki: '/iframe.html?id=components-table--default',
  },
};

// 설정
const CONFIG = {
  tdsBaseUrl: 'http://localhost:5173',
  thakiBaseUrl: 'http://localhost:6006',
  viewport: { width: 1280, height: 720 },
  threshold: 0.1, // 픽셀 차이 허용치 (0-1)
};

/**
 * 스크린샷 캡처
 */
async function captureScreenshot(page, url, outputPath, selector = null) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500); // 애니메이션 대기
  
  if (selector) {
    const element = await page.$(selector);
    if (element) {
      await element.screenshot({ path: outputPath });
      return true;
    }
  }
  
  await page.screenshot({ path: outputPath, fullPage: false });
  return true;
}

/**
 * 두 이미지 비교
 */
function compareImages(img1Path, img2Path, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  
  // 크기가 다르면 더 큰 쪽에 맞춤
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);
  
  // 크기 조정된 이미지 생성
  const resized1 = resizeImage(img1, width, height);
  const resized2 = resizeImage(img2, width, height);
  
  const diff = new PNG({ width, height });
  
  const numDiffPixels = pixelmatch(
    resized1.data,
    resized2.data,
    diff.data,
    width,
    height,
    { threshold: CONFIG.threshold }
  );
  
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  
  const totalPixels = width * height;
  const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);
  
  return {
    diffPixels: numDiffPixels,
    totalPixels,
    diffPercent,
    width,
    height,
  };
}

/**
 * 이미지 크기 조정 (패딩 추가)
 */
function resizeImage(img, targetWidth, targetHeight) {
  const resized = new PNG({ width: targetWidth, height: targetHeight });
  
  // 흰색으로 채우기
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (targetWidth * y + x) << 2;
      resized.data[idx] = 255;     // R
      resized.data[idx + 1] = 255; // G
      resized.data[idx + 2] = 255; // B
      resized.data[idx + 3] = 255; // A
    }
  }
  
  // 원본 이미지 복사
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const srcIdx = (img.width * y + x) << 2;
      const dstIdx = (targetWidth * y + x) << 2;
      resized.data[dstIdx] = img.data[srcIdx];
      resized.data[dstIdx + 1] = img.data[srcIdx + 1];
      resized.data[dstIdx + 2] = img.data[srcIdx + 2];
      resized.data[dstIdx + 3] = img.data[srcIdx + 3];
    }
  }
  
  return resized;
}

/**
 * HTML 리포트 생성
 */
function generateReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Diff Report - TDS vs thaki-ui</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 24px; }
    h1 { font-size: 24px; margin-bottom: 8px; color: #1e293b; }
    .summary { color: #64748b; margin-bottom: 24px; }
    .component { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .component-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .component-name { font-size: 18px; font-weight: 600; color: #1e293b; }
    .diff-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .diff-badge.pass { background: #dcfce7; color: #166534; }
    .diff-badge.fail { background: #fee2e2; color: #991b1b; }
    .diff-badge.warn { background: #fef9c3; color: #854d0e; }
    .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .image-box { text-align: center; }
    .image-box img { max-width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; }
    .image-label { font-size: 12px; color: #64748b; margin-top: 8px; }
    .stats { display: flex; gap: 24px; margin-top: 12px; font-size: 13px; color: #64748b; }
    .error { color: #dc2626; padding: 12px; background: #fef2f2; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>Visual Diff Report</h1>
  <p class="summary">Generated: ${new Date().toLocaleString('ko-KR')} | Components: ${results.length}</p>
  
  ${results.map(r => `
    <div class="component">
      <div class="component-header">
        <span class="component-name">${r.name}</span>
        ${r.error 
          ? '<span class="diff-badge fail">Error</span>'
          : r.diffPercent === '0.00'
            ? '<span class="diff-badge pass">✓ Identical</span>'
            : parseFloat(r.diffPercent) < 5
              ? '<span class="diff-badge warn">${r.diffPercent}% diff</span>'
              : '<span class="diff-badge fail">${r.diffPercent}% diff</span>'
        }
      </div>
      ${r.error 
        ? `<div class="error">${r.error}</div>`
        : `
          <div class="images">
            <div class="image-box">
              <img src="${r.tdsImage}" alt="TDS">
              <div class="image-label">TDS (Design System)</div>
            </div>
            <div class="image-box">
              <img src="${r.thakiImage}" alt="thaki-ui">
              <div class="image-label">thaki-ui (Production)</div>
            </div>
            <div class="image-box">
              <img src="${r.diffImage}" alt="Diff">
              <div class="image-label">Difference (Red = Changed)</div>
            </div>
          </div>
          <div class="stats">
            <span>Size: ${r.width}×${r.height}px</span>
            <span>Diff Pixels: ${r.diffPixels.toLocaleString()} / ${r.totalPixels.toLocaleString()}</span>
            <span>Diff: ${r.diffPercent}%</span>
          </div>
        `
      }
    </div>
  `).join('')}
</body>
</html>
  `.trim();
  
  const reportPath = path.join(OUTPUT_DIR, 'report.html');
  fs.writeFileSync(reportPath, html);
  return reportPath;
}

/**
 * 단일 컴포넌트 비교
 */
async function compareComponent(browser, name, config) {
  console.log(`\n📸 Comparing: ${name}`);
  
  const componentDir = path.join(OUTPUT_DIR, name);
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  }
  
  const tdsPath = path.join(componentDir, 'tds.png');
  const thakiPath = path.join(componentDir, 'thaki.png');
  const diffPath = path.join(componentDir, 'diff.png');
  
  const context = await browser.newContext({ viewport: CONFIG.viewport });
  const page = await context.newPage();
  
  try {
    // TDS 스크린샷
    const tdsUrl = CONFIG.tdsBaseUrl + config.tds;
    console.log(`  → TDS: ${tdsUrl}`);
    await captureScreenshot(page, tdsUrl, tdsPath, config.selector);
    
    // thaki-ui 스크린샷
    const thakiUrl = CONFIG.thakiBaseUrl + config.thaki;
    console.log(`  → thaki-ui: ${thakiUrl}`);
    await captureScreenshot(page, thakiUrl, thakiPath, config.selector);
    
    // 비교
    const result = compareImages(tdsPath, thakiPath, diffPath);
    
    console.log(`  ✓ Diff: ${result.diffPercent}% (${result.diffPixels} pixels)`);
    
    await context.close();
    
    return {
      name,
      tdsImage: path.relative(OUTPUT_DIR, tdsPath),
      thakiImage: path.relative(OUTPUT_DIR, thakiPath),
      diffImage: path.relative(OUTPUT_DIR, diffPath),
      ...result,
    };
  } catch (error) {
    console.log(`  ✗ Error: ${error.message}`);
    await context.close();
    return { name, error: error.message };
  }
}

/**
 * 메인 실행
 */
async function main() {
  const args = process.argv.slice(2);
  
  // 인자 파싱
  let componentsToCompare = [];
  let tdsUrl = CONFIG.tdsBaseUrl;
  let thakiUrl = CONFIG.thakiBaseUrl;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--component' && args[i + 1]) {
      componentsToCompare.push(args[i + 1]);
      i++;
    } else if (args[i] === '--all') {
      componentsToCompare = Object.keys(COMPONENT_MAP);
    } else if (args[i] === '--tds' && args[i + 1]) {
      tdsUrl = args[i + 1];
      i++;
    } else if (args[i] === '--thaki' && args[i + 1]) {
      thakiUrl = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      console.log(`
Visual Comparison Tool - TDS vs thaki-ui

사용법:
  node scripts/visual-compare.mjs [options]

옵션:
  --all                 모든 컴포넌트 비교
  --component <name>    특정 컴포넌트 비교 (여러 번 사용 가능)
  --tds <url>          TDS 서버 URL (기본: http://localhost:5173)
  --thaki <url>        thaki-ui 서버 URL (기본: http://localhost:6006)
  --help               도움말 표시

예시:
  node scripts/visual-compare.mjs --all
  node scripts/visual-compare.mjs --component Button --component Input
  node scripts/visual-compare.mjs --tds http://localhost:3000 --component Button

지원 컴포넌트:
  ${Object.keys(COMPONENT_MAP).join(', ')}
      `);
      process.exit(0);
    }
  }
  
  if (componentsToCompare.length === 0) {
    console.log('비교할 컴포넌트를 지정해주세요. --help 참조');
    process.exit(1);
  }
  
  CONFIG.tdsBaseUrl = tdsUrl;
  CONFIG.thakiBaseUrl = thakiUrl;
  
  console.log('🔍 Visual Comparison Tool');
  console.log(`   TDS: ${CONFIG.tdsBaseUrl}`);
  console.log(`   thaki-ui: ${CONFIG.thakiBaseUrl}`);
  console.log(`   Components: ${componentsToCompare.join(', ')}`);
  
  // 출력 디렉토리 생성
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 브라우저 시작
  const browser = await chromium.launch();
  const results = [];
  
  for (const name of componentsToCompare) {
    const config = COMPONENT_MAP[name];
    if (!config) {
      console.log(`\n⚠️  Unknown component: ${name}`);
      results.push({ name, error: 'Component not found in COMPONENT_MAP' });
      continue;
    }
    
    const result = await compareComponent(browser, name, config);
    results.push(result);
  }
  
  await browser.close();
  
  // 리포트 생성
  const reportPath = generateReport(results);
  console.log(`\n📊 Report generated: ${reportPath}`);
  console.log(`   Open: file://${reportPath}`);
  
  // 요약
  const passed = results.filter(r => !r.error && r.diffPercent === '0.00').length;
  const warnings = results.filter(r => !r.error && parseFloat(r.diffPercent) > 0 && parseFloat(r.diffPercent) < 5).length;
  const failed = results.filter(r => r.error || parseFloat(r.diffPercent) >= 5).length;
  
  console.log(`\n📈 Summary: ✓ ${passed} passed | ⚠️  ${warnings} warnings | ✗ ${failed} failed`);
}

main().catch(console.error);
