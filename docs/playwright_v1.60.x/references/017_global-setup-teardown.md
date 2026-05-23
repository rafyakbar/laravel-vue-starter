# Global Setup and Teardown

> Source: https://playwright.dev/docs/test-global-setup-teardown

## Background

There are two ways to configure global setup and teardown: using project dependencies (recommended) or using `globalSetup`/`globalTeardown` configuration options.

## Option 1: Project Dependencies (Recommended)

Project dependencies are a list of projects that need to run before tests in another project run. This approach integrates better with the test runner.

### Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium with db',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ],
});
```

### Setup Test File

```typescript
// tests/global.setup.ts
import { test as setup } from '@playwright/test';

setup('create new database', async ({}) => {
  console.log('creating new database...');
  // Initialize the database
});
```

### Teardown

Add a `teardown` property to run cleanup after all dependent projects:

```typescript
export default defineConfig({
  projects: [
    {
      name: 'setup db',
      testMatch: /global\.setup\.ts/,
      teardown: 'cleanup db',
    },
    {
      name: 'cleanup db',
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup db'],
    },
  ],
});
```

### Teardown File

```typescript
// tests/global.teardown.ts
import { test as teardown } from '@playwright/test';

teardown('delete database', async ({}) => {
  console.log('deleting test database...');
  // Delete the database
});
```

## Option 2: globalSetup and globalTeardown

Use these options for simpler setup scenarios:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

### Example: Authentication

```typescript
// global-setup.ts
import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(baseURL!);
  await page.getByLabel('User Name').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByText('Sign in').click();
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
```

## Comparison

| Feature | Project Dependencies | globalSetup |
|---------|---------------------|-------------|
| Runs before all tests | ✅ | ✅ |
| HTML report visibility | ✅ Shown | ❌ Not shown |
| Trace recording | ✅ Full trace | ❌ Not supported |
| Playwright fixtures | ✅ Supported | ❌ Not supported |
| Browser management | ✅ Via browser fixture | ❌ Manual |

## Passing Data to Tests

Use environment variables:

```typescript
// global-setup.ts
async function globalSetup(config: FullConfig) {
  process.env.FOO = 'some data';
  process.env.BAR = JSON.stringify({ some: 'data' });
}

export default globalSetup;
```

```typescript
// test file
test('test', async ({ page }) => {
  const { FOO, BAR } = process.env;
  expect(FOO).toEqual('some data');
});
```

## Best Practices

- Use project dependencies for better integration with test runner
- Use `globalSetup` only for simple scenarios
- Clean up resources in teardown
- Share authentication state via `storageState`
