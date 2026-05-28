import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './automation/web/playwright/tests',

  timeout: 30_000,

  expect: {

    timeout: 5_000,

  },

  fullyParallel: false,

  retries: 0,

  reporter: [

    ['list'],

    ['html', { outputFolder: 'automation/web/playwright/playwright-report' }],

  ],

  use: {

    baseURL: 'https://example.com',

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

  },

  projects: [

    {

      name: 'chromium',

      use: { ...devices['Desktop Chrome'] },

    },

    {

      name: 'firefox',

      use: { ...devices['Desktop Firefox'] },

    },

    {

      name: 'webkit',

      use: { ...devices['Desktop Safari'] },

    },

  ],

});