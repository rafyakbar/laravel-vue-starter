# Fixtures

> Source: https://playwright.dev/docs/test-fixtures

## Background

Playwright Test is based on test fixtures. Test fixtures establish the environment for each test, giving the test everything it needs and nothing else. Fixtures are isolated between tests.

## Built-in Fixtures

| Fixture | Type | Description |
|---------|------|-------------|
| `page` | Page | Isolated page for this test run |
| `context` | BrowserContext | Isolated context for this test run |
| `browser` | Browser | Browsers are shared across tests |
| `browserName` | string | The name of the browser (chromium, firefox, webkit) |
| `request` | APIRequestContext | Isolated API request context |

## Creating a Fixture

Use `test.extend()` to create custom fixtures:

```typescript
import { test as base } from '@playwright/test';
import { TodoPage } from './todo-page';

type MyFixtures = {
  todoPage: TodoPage;
};

export const test = base.extend<MyFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
    await todoPage.removeAll();
  },
});

export { expect } from '@playwright/test';
```

## Using a Fixture

```typescript
import { test, expect } from './my-test';

test('basic test', async ({ todoPage, page }) => {
  await todoPage.addToDo('something nice');
  await expect(page.getByTestId('todo-title')).toContainText(['something nice']);
});
```

## Overriding Fixtures

Override existing fixtures to fit your needs:

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    await page.goto(baseURL);
    await use(page);
  },
});
```

## Worker-scoped Fixtures

Worker fixtures are set up once per worker process:

```typescript
import { test as base } from '@playwright/test';

type Account = { username: string; password: string };

export const test = base.extend<{}, { account: Account }>({
  account: [async ({ browser }, use, workerInfo) => {
    const username = 'user' + workerInfo.workerIndex;
    const password = 'verysecure';
    
    // Create account...
    await use({ username, password });
  }, { scope: 'worker' }],
});
```

## Automatic Fixtures

Automatic fixtures run even when not explicitly used:

```typescript
export const test = base.extend<{ saveLogs: void }>({
  saveLogs: [async ({}, use, testInfo) => {
    // Collect logs during test
    const logs: string[] = [];
    
    await use();
    
    // After test, save logs if failed
    if (testInfo.status !== testInfo.expectedStatus) {
      const logFile = testInfo.outputPath('logs.txt');
      await fs.promises.writeFile(logFile, logs.join('\n'));
    }
  }, { auto: true }],
});
```

## Fixture Options

Create configurable options:

```typescript
export type MyOptions = { defaultItem: string };

export const test = base.extend<MyOptions & MyFixtures>({
  defaultItem: ['Something nice', { option: true }],
  
  todoPage: async ({ page, defaultItem }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.addToDo(defaultItem);
    await use(todoPage);
  },
});
```

Then configure in `playwright.config.ts`:

```typescript
export default defineConfig({
  projects: [
    { name: 'shopping', use: { defaultItem: 'Buy milk' } },
    { name: 'wellbeing', use: { defaultItem: 'Exercise!' } },
  ],
});
```

## Combining Fixtures from Multiple Modules

```typescript
import { mergeTests } from '@playwright/test';
import { test as dbTest } from 'database-test-utils';
import { test as a11yTest } from 'a11y-test-utils';

export const test = mergeTests(dbTest, a11yTest);
```

## Best Practices

- Use fixtures to encapsulate setup and teardown
- Make fixtures reusable across test files
- Use worker-scoped fixtures for expensive setup
- Define options for configurable fixtures
- Box non-interesting helper fixtures with `{ box: true }`
