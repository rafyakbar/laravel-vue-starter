# Configuration

> Source: https://playwright.dev/docs/test-configuration

## Background

Playwright has many options to configure how your tests are run. Test runner options are top-level in the configuration file.

## Basic Configuration

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory
  testDir: 'tests',
  
  // Run all tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: 'html',
  
  use: {
    // Base URL to use in actions
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Key Configuration Options

| Option | Description |
|--------|-------------|
| `testConfig.forbidOnly` | Whether to exit with error if any tests are marked as `test.only` |
| `testConfig.fullyParallel` | Run all tests in all files in parallel |
| `testConfig.projects` | Run tests in multiple configurations or on multiple browsers |
| `testConfig.reporter` | Reporter to use |
| `testConfig.retries` | Maximum number of retry attempts per test |
| `testConfig.testDir` | Directory with test files |
| `testConfig.use` | Options with `use{}` |
| `testConfig.webServer` | Launch a server during the tests |
| `testConfig.workers` | Maximum number of concurrent worker processes |

## Filtering Tests

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Glob patterns to ignore test files
  testIgnore: '*test-assets',
  
  // Glob patterns that match test files
  testMatch: '*todo-tests/*.spec.ts',
});
```

## Advanced Configuration

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Folder for test artifacts
  outputDir: 'test-results',
  
  // Path to global setup files
  globalSetup: require.resolve('./global-setup'),
  
  // Path to global teardown files
  globalTeardown: require.resolve('./global-teardown'),
  
  // Each test is given 30 seconds
  timeout: 30000,
});
```

## Expect Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    // Maximum time expect() should wait
    timeout: 5000,
    toHaveScreenshot: {
      // Acceptable pixels that could be different
      maxDiffPixels: 10,
    },
    toMatchSnapshot: {
      // Acceptable ratio of different pixels
      maxDiffPixelRatio: 0.1,
    },
  },
});
```

## Best Practices

- Use `forbidOnly: true` on CI to prevent accidentally committed `test.only`
- Set different `retries` and `workers` for CI vs local development
- Use `testMatch` and `testIgnore` to control which tests run
- Configure `expect` timeout separately from test timeout
