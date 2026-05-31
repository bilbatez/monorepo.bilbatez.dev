import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 2,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [['dot'], ['html', { open: 'never' }]]
    : [['line'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [{ name: 'Google Chrome', use: { ...devices['Desktop Chrome'] } }]
    : [
        { name: 'Google Chrome', use: { ...devices['Desktop Chrome'] } },
        { name: 'Firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'Safari', use: { ...devices['Desktop Safari'] } },
        { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
        { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
      ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: process.env.CI
        ? 'bun run --filter "bilbatez.dev" preview'
        : 'bun run --filter "bilbatez.dev" dev',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: process.env.CI
        ? 'bun run --filter "kprfordummies" preview'
        : 'bun run --filter "kprfordummies" dev',
      url: 'http://127.0.0.1:3002',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: process.env.CI
        ? 'bun run --filter "algo-compendium" preview'
        : 'bun run --filter "algo-compendium" dev',
      url: 'http://127.0.0.1:3003',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
