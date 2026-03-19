import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 120_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.3,
    },
  },
  use: {
    viewport: { width: 1440, height: 900 },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
