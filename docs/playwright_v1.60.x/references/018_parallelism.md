# Parallelism

> Source: https://playwright.dev/docs/test-parallel

## Background

Playwright Test runs tests in parallel using worker processes. By default, test files are run in parallel while tests in a single file run in order.

## Worker Processes

All tests run in worker processes that are OS processes running independently. All workers have identical environments and each starts its own browser.

- Workers are reused as much as possible for faster testing
- Workers are always shutdown after a test failure to guarantee pristine environment

## Limit Workers

Control the maximum number of parallel worker processes:

```bash
# Command line
npx playwright test --workers 4
```

```typescript
// Configuration file
export default defineConfig({
  workers: process.env.CI ? 2 : undefined,
});
```

## Disable Parallelism

Allow just a single worker:

```bash
npx playwright test --workers=1
```

## Parallelize Tests in a Single File

By default, tests in a single file run in order. Run them in parallel with `test.describe.configure()`:

```typescript
import { test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test('runs in parallel 1', async ({ page }) => { /* ... */ });
test('runs in parallel 2', async ({ page }) => { /* ... */ });
```

Enable fully-parallel mode in configuration:

```typescript
export default defineConfig({
  fullyParallel: true,
});
```

## Serial Mode

Annotate inter-dependent tests as serial. If one fails, all subsequent tests are skipped:

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

## Opt Out of Fully Parallel Mode

Override the mode per describe:

```typescript
test.describe('runs in parallel with other describes', () => {
  test.describe.configure({ mode: 'default' });
  
  test('in order 1', async ({ page }) => {});
  test('in order 2', async ({ page }) => {});
});
```

## Shard Tests Between Multiple Machines

```bash
npx playwright test --shard=2/3
```

## Limit Failures and Fail Fast

Stop after reaching a number of failed tests:

```bash
npx playwright test --max-failures=10
```

```typescript
export default defineConfig({
  maxFailures: process.env.CI ? 10 : undefined,
});
```

## Worker Index and Parallel Index

Each worker process is assigned two IDs:

- `workerIndex`: unique index starting with 1
- `parallelIndex`: between 0 and `workers - 1`

Access via environment variables or `testInfo`:

```typescript
// Environment variables
process.env.TEST_WORKER_INDEX
process.env.TEST_PARALLEL_INDEX

// TestInfo
test.info().workerIndex
test.info().parallelIndex
```

## Isolate Test Data Between Workers

Use `workerIndex` to isolate user data:

```typescript
import { test as baseTest, expect } from '@playwright/test';

export const test = baseTest.extend<{}, { dbUserName: string }>({
  dbUserName: [async ({}, use) => {
    const userName = `user-${test.info().workerIndex}`;
    await createUserInTestDatabase(userName);
    await use(userName);
    await deleteUserFromTestDatabase(userName);
  }, { scope: 'worker' }],
});
```

## Best Practices

- Make tests isolated so they can run independently
- Use `fullyParallel: true` for maximum parallelization
- Use serial mode sparingly - it's usually better to make tests isolated
- Limit workers on CI to avoid resource exhaustion
- Use `maxFailures` to stop early on broken test suites
