# Projects

> Source: https://playwright.dev/docs/test-projects

## Background

A project is a logical group of tests running with the same configuration. Projects are used to run tests on different browsers and devices, or with different configurations.

## Configure Projects for Multiple Browsers

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
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
    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* Test against branded browsers */
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
});
```

## Run Projects

Playwright runs all projects by default:

```bash
npx playwright test
```

Run a single project:

```bash
npx playwright test --project=firefox
```

## Configure Projects for Multiple Environments

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  projects: [
    {
      name: 'staging',
      use: { baseURL: 'staging.example.com' },
      retries: 2,
    },
    {
      name: 'production',
      use: { baseURL: 'production.example.com' },
      retries: 0,
    },
  ],
});
```

## Splitting Tests into Projects

Use filters to run subsets of tests:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  projects: [
    {
      name: 'Smoke',
      testMatch: /.*smoke\.spec\.ts/,
      retries: 0,
    },
    {
      name: 'Default',
      testIgnore: /.*smoke\.spec\.ts/,
      retries: 2,
    },
  ],
});
```

## Dependencies

Configure projects that must run before others:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
  ],
});
```

### Running Sequence

1. Tests in the 'setup' project run first
2. Once all setup tests pass, dependent projects run in parallel

### Teardown

Add teardown to run cleanup after all dependent projects:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      teardown: 'cleanup',
    },
    {
      name: 'cleanup',
      testMatch: '**/*.teardown.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
```

### Test Filtering

Use `--no-deps` to ignore dependencies:

```bash
npx playwright test --no-deps
```

## Best Practices

- Use projects to test across multiple browsers
- Configure different timeouts and retries per environment
- Use `testMatch` and `testIgnore` to split test suites
- Use dependencies for global setup requirements
- Add teardown to clean up resources after tests
