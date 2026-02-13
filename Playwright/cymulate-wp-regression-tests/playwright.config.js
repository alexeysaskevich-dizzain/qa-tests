// @ts-check
import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  // Global timeout per test (2 minutes)
  timeout: 120_000,

  // Timeout for expect() assertions
  expect: {
    timeout: 20_000,
  },

  // Run tests in parallel
  fullyParallel: true,

  // Fail build if test.only is committed
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,

  // HTML report
  reporter: 'html',

  // Shared test settings
  use: {
    // Navigation and action timeouts
    navigationTimeout: 60_000,
    actionTimeout: 30_000,

    // Default viewport (desktop)
    viewport: { width: 1440, height: 900 },

    // Capture screenshots only when tests fail
    screenshot: 'only-on-failure',

    // Collect trace on first retry
    trace: 'on-first-retry',
  },

  // Visual regression viewports
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'mobile',
      use: {
        viewport: { width: 375, height: 812 },
        isMobile: true,
      },
    },
  ],
});