# Best Practices

> Source: https://playwright.dev/docs/best-practices

## Background

This guide helps ensure you follow Playwright best practices and write resilient tests.

## Testing Philosophy

### Test User-Visible Behavior

Automated tests should verify that application code works for end users. Avoid relying on implementation details such as function names, internal data structures, or CSS classes. Tests should interact with what is rendered on the page.

### Make Tests Isolated

Each test should be completely isolated with its own local storage, session storage, data, and cookies. Test isolation improves reproducibility, makes debugging easier, and prevents cascading test failures.

Use `beforeEach` hooks for common setup:

```typescript
import { test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.getByLabel('Username or email address').fill('username');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
});

test('first', async ({ page }) => {
  // page is signed in
});
```

### Avoid Testing Third-Party Dependencies

Only test what you control. Don't test links to external sites or third-party servers. Instead, use the Playwright Network API to mock responses:

```typescript
await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({
  status: 200,
  body: testData,
}));
await page.goto('https://example.com');
```

## Locators

### Use Locators

Use Playwright's built-in locators with auto-waiting and retry-ability. Prioritize user-facing attributes:

```typescript
// Good
page.getByRole('button', { name: 'submit' });

// Bad - relies on implementation details
page.locator('button.buttonIcon.episode-actions-later');
```

### Use Chaining and Filtering

```typescript
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });

await page
  .getByRole('listitem')
  .filter({ hasText: 'Product 2' })
  .getByRole('button', { name: 'Add to cart' })
  .click();
```

### Generate Locators

Use `codegen` or VS Code extension to generate resilient locators:

```bash
npx playwright codegen playwright.dev
```

## Assertions

### Use Web-First Assertions

Web-first assertions wait until the condition is met:

```typescript
// Good
await expect(page.getByText('welcome')).toBeVisible();

// Bad - doesn't wait
expect(await page.getByText('welcome').isVisible()).toBe(true);
```

## Debugging

### Local Debugging

Debug tests live in VS Code with the extension, or use the Playwright inspector:

```bash
npx playwright test --debug
```

### CI Debugging

Use the trace viewer instead of videos and screenshots. Configure traces in the config file to run on first retry:

```typescript
use: {
  trace: 'on-first-retry',
}
```

Run traces locally:

```bash
npx playwright test --trace on
npx playwright show-report
```

## Tooling

- **VS Code extension**: Great developer experience for writing, running, and debugging tests
- **Test generator**: Generate tests and pick locators automatically
- **Trace viewer**: Full trace of tests as a local PWA
- **UI Mode**: Explore, run, and debug tests with time travel
- **TypeScript**: Works out of the box, provides better IDE integrations

## Test Across All Browsers

Configure projects in the config file:

```typescript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Keep Playwright Updated

```bash
npm install -D @playwright/test@latest
npx playwright install
```

## CI Best Practices

- Run tests on each commit and pull request
- Use Linux for cheaper CI costs
- Use sharding for faster CI
- Only install browsers you need:

```bash
npx playwright install chromium --with-deps
```

## Lint Tests

Use TypeScript and ESLint with `@typescript-eslint/no-floating-promises` rule to catch missing awaits.

## Parallelism and Sharding

Run tests in parallel within a file:

```typescript
test.describe.configure({ mode: 'parallel' });
```

Shard tests across multiple machines:

```bash
npx playwright test --shard=1/3
```

## Soft Assertions

Soft assertions don't immediately terminate test execution:

```typescript
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await page.getByRole('link', { name: 'next page' }).click();
```

## Best Practices

- Test user-visible behavior, not implementation details
- Keep tests isolated with their own state
- Use locators that are resilient to DOM changes
- Use web-first assertions for automatic waiting
- Debug with VS Code extension or trace viewer
- Run tests across all browsers
- Keep Playwright updated regularly
- Use sharding for faster CI execution
