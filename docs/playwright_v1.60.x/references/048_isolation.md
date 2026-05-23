# Isolation

> Source: https://playwright.dev/docs/browser-contexts

## Background

Tests written with Playwright execute in isolated clean-slate environments called browser contexts. This isolation model improves reproducibility and prevents cascading test failures.

## What is Test Isolation?

Each test runs completely isolated from any other test. Every test has its own:
- Local storage
- Session storage
- Cookies
- IndexedDB

Playwright achieves this using BrowserContexts - equivalent to incognito-like profiles that are fast and cheap to create.

## Why is Test Isolation Important?

- **No failure carry-over**: If one test fails, it doesn't affect other tests
- **Easy debugging**: Run a single test as many times as needed
- **Parallel execution**: No need to think about order when running tests in parallel

## Isolation Strategies

### Start from Scratch (Recommended)

Everything is new for each test. If a test fails, you only look within that test to debug.

### Cleanup Between Tests

Problem: Easy to forget cleanup, some things are impossible to clean up (e.g., "visited links"). State can leak between tests causing flaky failures.

## Default Behavior

Playwright Test creates a browser context for each test:

```typescript
import { test } from '@playwright/test';

test('example test', async ({ page, context }) => {
  // "context" is an isolated BrowserContext for this test
  // "page" belongs to this context
});

test('another test', async ({ page, context }) => {
  // "context" and "page" are completely isolated from the first test
});
```

## Multiple Contexts in a Single Test

Create multiple contexts for multi-user scenarios:

```typescript
import { test } from '@playwright/test';

test('admin and user', async ({ browser }) => {
  // Create two isolated browser contexts
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();

  // Create pages and interact independently
  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();
});
```

## Context Configuration

Browser contexts can emulate:
- Mobile devices
- Permissions
- Locale
- Color scheme
- Viewport
- User agent

See the Emulation guide for more details.

## Best Practices

- Let Playwright create contexts automatically for each test
- Use multiple contexts when testing multi-user scenarios
- Always close contexts when manually creating them
- Configure context options in `playwright.config.ts` or `test.use()`
