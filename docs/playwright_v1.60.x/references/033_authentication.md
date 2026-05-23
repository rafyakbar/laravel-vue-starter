# Authentication

> Source: https://playwright.dev/docs/auth

## Background

Playwright executes tests in isolated environments called browser contexts. Tests can load existing authenticated state, eliminating the need to authenticate in every test and speeding up execution.

## Setup

Create a directory for authentication state and add it to `.gitignore`:

```bash
mkdir -p playwright/.auth
echo 'playwright/.auth' >> .gitignore
```

**Warning:** Browser state files may contain sensitive cookies and headers. Never commit them to repositories.

## Basic: Shared Account in All Tests

Use when all tests can run simultaneously with the same account without affecting each other.

### Create Authentication Setup

```typescript
// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait for the final URL to ensure cookies are set
  await page.waitForURL('https://github.com/');

  // Alternative: wait for a visible element
  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();

  // Save authentication state
  await page.context().storageState({ path: authFile });
});
```

### Configure Projects

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  projects: [
    // Setup project
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

Tests start already authenticated because `storageState` is specified in config.

### UI Mode Authentication

UI Mode won't run the `setup` project by default. Manually run `auth.setup.ts` when authentication expires by enabling the setup project in filters, running it, then disabling it again.

## Moderate: One Account Per Parallel Worker

Use when tests modify shared server-side state.

### Create Worker Fixture

```typescript
// playwright/fixtures.ts
import { test as baseTest, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export * from '@playwright/test';
export const test = baseTest.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use) => {
    const id = test.info().parallelIndex;
    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);

    if (fs.existsSync(fileName)) {
      await use(fileName);
      return;
    }

    const page = await browser.newPage({ storageState: undefined });
    const account = await acquireAccount(id);

    // Perform authentication steps
    await page.goto('https://github.com/login');
    await page.getByLabel('Username or email address').fill(account.username);
    await page.getByLabel('Password').fill(account.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('https://github.com/');

    await page.context().storageState({ path: fileName });
    await page.close();
    await use(fileName);
  }, { scope: 'worker' }],
});
```

### Use the Fixture

```typescript
import { test, expect } from '../playwright/fixtures';

test('test', async ({ page }) => {
  // page is authenticated
});
```

## Advanced Scenarios

### Authenticate with API Request

```typescript
// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ request }) => {
  await request.post('https://github.com/login', {
    form: { 'user': 'user', 'password': 'password' }
  });
  await request.storageState({ path: authFile });
});
```

### Multiple Signed In Roles

```typescript
// tests/auth.setup.ts
const adminFile = 'playwright/.auth/admin.json';
const userFile = 'playwright/.auth/user.json';

setup('authenticate as admin', async ({ page }) => {
  // ... authenticate as admin
  await page.context().storageState({ path: adminFile });
});

setup('authenticate as user', async ({ page }) => {
  // ... authenticate as user
  await page.context().storageState({ path: userFile });
});
```

Use different states in tests:

```typescript
test.use({ storageState: 'playwright/.auth/admin.json' });
test('admin test', async ({ page }) => {
  // page is authenticated as admin
});

test.describe(() => {
  test.use({ storageState: 'playwright/.auth/user.json' });
  test('user test', async ({ page }) => {
    // page is authenticated as user
  });
});
```

### Testing Multiple Roles Together

```typescript
test('admin and user', async ({ browser }) => {
  const adminContext = await browser.newContext({
    storageState: 'playwright/.auth/admin.json'
  });
  const adminPage = await adminContext.newPage();

  const userContext = await browser.newContext({
    storageState: 'playwright/.auth/user.json'
  });
  const userPage = await userContext.newPage();

  // ... interact with both adminPage and userPage ...

  await adminContext.close();
  await userContext.close();
});
```

### Testing Multiple Roles with POM Fixtures

```typescript
// playwright/fixtures.ts
import { test as base, type Page, type Locator } from '@playwright/test';

class AdminPage {
  page: Page;
  greeting: Locator;
  constructor(page: Page) {
    this.page = page;
    this.greeting = page.locator('#greeting');
  }
}

type MyFixtures = { adminPage: AdminPage; userPage: UserPage };

export const test = base.extend<MyFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/admin.json'
    });
    const adminPage = new AdminPage(await context.newPage());
    await use(adminPage);
    await context.close();
  },
  // ... similar for userPage
});
```

### Session Storage

Session storage is not persisted automatically. Save and restore manually:

```typescript
// Get session storage
const sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));
fs.writeFileSync('playwright/.auth/session.json', sessionStorage, 'utf-8');

// Set session storage in new context
const sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));
await context.addInitScript(storage => {
  if (window.location.hostname === 'example.com') {
    for (const [key, value] of Object.entries(storage))
      window.sessionStorage.setItem(key, value);
  }
}, sessionStorage);
```

### Avoid Authentication in Some Tests

```typescript
import { test } from '@playwright/test';

// Reset storage state for this file
test.use({ storageState: { cookies: [], origins: [] } });

test('not signed in test', async ({ page }) => {
  // ...
});
```

## Best Practices

- Store authentication state in `playwright/.auth` and add to `.gitignore`
- Use setup projects with dependencies for shared authentication
- Use worker fixtures when tests modify server-side state
- Wait for final URL or visible element after login to ensure cookies are set
- Dispose browser contexts when testing multiple roles manually
- Use `testInfo.parallelIndex` to differentiate between workers
