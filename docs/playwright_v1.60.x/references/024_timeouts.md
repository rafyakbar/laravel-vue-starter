# Timeouts

> Source: https://playwright.dev/docs/test-timeouts

## Background

Playwright Test has multiple configurable timeouts for various tasks. Understanding these helps prevent flaky tests and optimize test execution.

## Timeout Overview

| Timeout | Default | Description |
|---------|---------|-------------|
| Test timeout | 30,000 ms | Timeout for each test |
| Expect timeout | 5,000 ms | Timeout for each assertion |

## Test Timeout

Playwright enforces a timeout for each test. Time spent by the test function, fixture setups, and `beforeEach` hooks is included.

### Set in Config

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 120_000,
});
```

### Set for Single Test

```typescript
import { test, expect } from '@playwright/test';

test('slow test', async ({ page }) => {
  test.slow(); // Easy way to triple the default timeout
  // ...
});

test('very slow test', async ({ page }) => {
  test.setTimeout(120_000);
  // ...
});
```

### Change from beforeEach Hook

```typescript
test.beforeEach(async ({ page }, testInfo) => {
  // Extend timeout for all tests running this hook
  testInfo.setTimeout(testInfo.timeout + 30_000);
});
```

### Change for beforeAll/afterAll Hooks

```typescript
test.beforeAll(async () => {
  test.setTimeout(60000);
});
```

## Expect Timeout

Auto-retrying assertions have a separate timeout:

### Set in Config

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
});
```

### Set for Single Assertion

```typescript
test('example', async ({ page }) => {
  await expect(locator).toHaveText('hello', { timeout: 10_000 });
});
```

## Global Timeout

Timeout for the whole test run prevents excess resource usage:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalTimeout: 3_600_000, // 1 hour
});
```

## Low-Level Timeouts

| Timeout | Default | Description |
|---------|---------|-------------|
| Action timeout | no timeout | Timeout for each action |
| Navigation timeout | no timeout | Timeout for each navigation |
| beforeAll/afterAll | 30,000 ms | Timeout for hooks |
| Fixture timeout | no timeout | Timeout for fixtures |

### Set Action and Navigation Timeouts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },
});
```

### Set Timeout for Single Action

```typescript
test('basic test', async ({ page }) => {
  await page.goto('https://playwright.dev', { timeout: 30000 });
  await page.getByText('Get Started').click({ timeout: 10000 });
});
```

## Fixture Timeout

Give slow fixtures a separate timeout:

```typescript
import { test as base, expect } from '@playwright/test';

const test = base.extend<{ slowFixture: string }>({
  slowFixture: [async ({}, use) => {
    // ... perform a slow operation ...
    await use('hello');
  }, { timeout: 60_000 }],
});

test('example test', async ({ slowFixture }) => {
  // ...
});
```

## Best Practices

- Set a reasonable global timeout for CI
- Use `test.slow()` for known slow tests
- Keep test timeout small, give slow fixtures separate timeouts
- Configure expect timeout based on your application's response times
- Use `test.setTimeout()` in hooks that need more time
