#!/usr/bin/env node
/**
 * figma-capture-headless.mjs
 *
 * Figma 페이지 캡처를 headless Chromium으로 백그라운드 실행합니다.
 * 브라우저 창을 띄우지 않고 캡처합니다.
 *
 * 사용법:
 *   node scripts/figma-capture-headless.mjs <url> <captureId> [delayMs]
 *
 * 예시:
 *   node scripts/figma-capture-headless.mjs \
 *     "http://localhost:5173/container/catalog" \
 *     "abcd-1234-efgh" \
 *     3000
 */

import pkg from '../node_modules/.pnpm/playwright@1.58.0/node_modules/playwright-core/index.js';
const { chromium } = pkg;

const [, , pageUrl, captureId, delayMs = '3000'] = process.argv;

if (!pageUrl || !captureId) {
  console.error('Usage: node figma-capture-headless.mjs <pageUrl> <captureId> [delayMs]');
  process.exit(1);
}

const endpoint = `https://mcp.figma.com/mcp/capture/${captureId}/submit`;
const captureUrl = `${pageUrl}#figmacapture=${captureId}&figmaendpoint=${encodeURIComponent(endpoint)}&figmadelay=${delayMs}`;

console.log(`[headless] Capturing: ${pageUrl}`);
console.log(`[headless] captureId: ${captureId}`);

const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({
  headless: true,
  executablePath: CHROME_PATH,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

const page = await context.newPage();

// 캡처 완료 신호: capture.js가 Figma 엔드포인트에 POST 성공 시 이벤트 발생
let captureSubmitted = false;

page.on('request', (req) => {
  if (req.url().includes(`/capture/${captureId}/submit`)) {
    console.log(`[headless] Capture request submitted to Figma`);
    captureSubmitted = true;
  }
});

page.on('response', (res) => {
  if (res.url().includes(`/capture/${captureId}/submit`)) {
    console.log(`[headless] Figma capture response: ${res.status()}`);
  }
});

await page.goto(captureUrl, { waitUntil: 'networkidle', timeout: 30000 });

// figmadelay 이후 capture.js가 POST를 보내므로 delayMs + 여유 3초 대기
const totalWait = parseInt(delayMs, 10) + 3000;
console.log(`[headless] Waiting ${totalWait}ms for capture to complete...`);
await page.waitForTimeout(totalWait);

if (!captureSubmitted) {
  console.warn('[headless] Warning: capture request not detected. Check if capture.js is loaded.');
}

await browser.close();
console.log(`[headless] Done: ${pageUrl}`);
