# Extensibility

> Source: https://playwright.dev/docs/extensibility

## Background

Playwright supports custom selector engines registered with `selectors.register()`. This allows you to create custom ways to locate elements on the page.

## Selector Engine Requirements

A selector engine must have:
- `query` function to query first element matching selector relative to root
- `queryAll` function to query all elements matching selector relative to root

## Registering a Custom Selector Engine

```typescript
import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

const createTagNameEngine = () => ({
  // Returns first element matching selector
  query(root, selector) {
    return root.querySelector(selector);
  },
  // Returns all elements matching selector
  queryAll(root, selector) {
    return Array.from(root.querySelectorAll(selector));
  }
});

export const test = base.extend<{}, { selectorRegistration: void }>({
  selectorRegistration: [async ({ playwright }, use) => {
    // Register the engine. Selectors prefixed with "tag="
    await playwright.selectors.register('tag', createTagNameEngine);
    await use();
  }, { scope: 'worker', auto: true }],
});
```

## Using Custom Selectors

```typescript
import { test, expect } from './baseTest';

test('selector engine test', async ({ page }) => {
  // Use 'tag=' selectors
  const button = page.locator('tag=button');
  await button.click();

  // Combine with built-in locators
  await page.locator('tag=div').getByText('Click me').click();

  // Use in assertions
  await expect(page.locator('tag=button')).toHaveCount(3);
});
```

## Content Script Option

By default, engines run in the frame's JavaScript context. To isolate from JavaScript tampering:

```typescript
await playwright.selectors.register('myEngine', createMyEngine, { contentScript: true });
```

Content script engines are protected from global object tampering, like `Node.prototype` modifications.

## Best Practices

- Register selectors before creating pages
- Use `{ contentScript: true }` for protection against tampering
- Register once per worker using fixtures with `auto: true`
- Name selectors with a clear prefix for identification
