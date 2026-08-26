import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Global setup path */
  globalSetup: new URL('./global.setup.ts', import.meta.url).pathname,
  /* Global teardown path */
  globalTeardown: new URL('./global.teardown.ts', import.meta.url).pathname,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'list',
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Directory to search for tests */
  testDir: './tests/e2e',
  testMatch: '**/{dashboard,closet,planning}.spec.ts',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.NUXT_PLAYWRIGHT_BASE_URL || 'http://localhost:8000',

    /* Storage state to reuse the login session. */
    storageState: './tests/state.json',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: !process.env.CI,
    url: process.env.NUXT_PLAYWRIGHT_BASE_URL || 'http://localhost:8000',
  },

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
});
