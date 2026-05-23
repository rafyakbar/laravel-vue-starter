# Annotations

> Source: https://playwright.dev/docs/test-annotations

## Background

Playwright supports tags and annotations that are displayed in the test report. Built-in annotations include `test.skip()`, `test.fail()`, `test.fixme()`, and `test.slow()`.

## Built-in Annotations

- `test.skip()` marks the test as irrelevant. Playwright does not run such a test.
- `test.fail()` marks the test as failing. Playwright will run this test and ensure it does indeed fail.
- `test.fixme()` marks the test as failing. Playwright will not run this test.
- `test.slow()` marks the test as slow and triples the test timeout.

## Focus a Test

```typescript
test.only('focus this test', async ({ page }) => {
  // Run only focused tests in the entire project
});
```

## Skip a Test

```typescript
test.skip('skip this test', async ({ page }) => {
  // This test is not run
});
```

## Conditionally Skip a Test

```typescript
test('skip this test', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'Still working on it');
});
```

## Group Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('two tests', () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

## Tag Tests

Tags allow filtering tests in the test report or running specific subsets:

```typescript
import { test, expect } from '@playwright/test';

test('test login page', {
  tag: '@fast',
}, async ({ page }) => {
  // ...
});

test('test full report @slow', async ({ page }) => {
  // ...
});
```

Run tests with a specific tag:

```bash
npx playwright test --grep @fast
```

Skip tests with a specific tag:

```bash
npx playwright test --grep-invert @fast
```

## Annotate Tests

Annotations have a `type` and a `description` for additional context:

```typescript
import { test, expect } from '@playwright/test';

test('test login page', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/microsoft/playwright/issues/23180',
  },
}, async ({ page }) => {
  // ...
});
```

## Runtime Annotations

Add annotations during test execution:

```typescript
test('example test', async ({ page, browser }) => {
  test.info().annotations.push({
    type: 'browser version',
    description: browser.version(),
  });
});
```

## Best Practices

- Use tags to categorize tests for easy filtering
- Use annotations to link tests to issues or documentation
- Use conditional skips for browser-specific or environment-specific tests
- Group related tests with `test.describe()`
