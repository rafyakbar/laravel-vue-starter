# Retries

> Source: https://playwright.dev/docs/test-retries

## Background

Test retries automatically re-run a test when it fails. This is useful for flaky tests that fail intermittently.

## How Failures Work

Playwright Test runs tests in worker processes. When a test fails, the worker process and browser are discarded, and a new worker starts with the next test.

### With Retries Enabled

If a test fails, it will be retried in the new worker process:

- Worker #1: Test fails
- Worker #2: Test is retried

## Configure Retries

```bash
# Give failing tests 3 retry attempts
npx playwright test --retries=3
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: 3,
});
```

## Test Categories

- "passed" - tests that passed on the first run
- "flaky" - tests that failed on first run but passed on retry
- "failed" - tests that failed on first run and all retries

## Detect Retries at Runtime

Use `testInfo.retry` to detect retry attempts:

```typescript
import { test, expect } from '@playwright/test';

test('my test', async ({ page }, testInfo) => {
  if (testInfo.retry)
    await cleanSomeCachesOnTheServer();
  // ...
});
```

## Configure Retries per Describe

```typescript
import { test, expect } from '@playwright/test';

test.describe(() => {
  test.describe.configure({ retries: 2 });
  
  test('test 1', async ({ page }) => { /* ... */ });
  test('test 2', async ({ page }) => { /* ... */ });
});
```

## Serial Mode

Group dependent tests so they run together and in order. If one fails, subsequent tests are skipped. All tests are retried together:

```typescript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.beforeAll(async () => { /* ... */ });
test('first good', async ({ page }) => { /* ... */ });
test('second flaky', async ({ page }) => { /* ... */ });
test('third good', async ({ page }) => { /* ... */ });
```

## Reuse Single Page Between Tests

Create and manage a shared page:

```typescript
import { test, type Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('runs first', async () => {
  await page.goto('https://playwright.dev/');
});

test('runs second', async () => {
  await page.getByText('Get Started').click();
});
```

## Best Practices

- Enable retries on CI but not locally for faster debugging
- Investigate flaky tests rather than just increasing retries
- Use serial mode sparingly - isolated tests are preferable
- Clean up state in `beforeEach` when a retry is detected
- Don't use serial mode for independent tests
