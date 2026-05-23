# Chrome Extensions

> Source: https://playwright.dev/docs/chrome-extensions

## Background

Playwright can test Chrome extensions. Extensions only work in Chromium with a persistent context. Use the bundled Chromium, not branded Chrome or Edge.

## Loading an Extension

```javascript
const { chromium } = require('playwright');

(async () => {
  const pathToExtension = require('path').join(__dirname, 'my-extension');
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });

  let [serviceWorker] = browserContext.serviceWorkers();
  if (!serviceWorker)
    serviceWorker = await browserContext.waitForEvent('serviceworker');

  // Test the service worker
  await browserContext.close();
})();
```

## Service Worker Idle Suspension (MV3)

Chrome MV3 service workers are automatically suspended after ~30 seconds of inactivity. Playwright keeps the same `Worker` object alive - no new `'serviceworker'` event is emitted. `evaluate()` calls are stalled until the new context is ready:

```javascript
const sw = await context.waitForEvent('serviceworker');
// ... SW suspends after 30 s of inactivity and is restarted ...
await sw.evaluate(() => sendMessage({ type: 'ping' })); // just works
```

**Note:** `evaluate()` calls in-flight at the moment of suspension will throw `"Service worker restarted"`.

## Testing Extensions

Use test fixtures to set up the context and dynamically retrieve the extension ID:

### Create Fixtures

```typescript
// fixtures.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, 'my-extension');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // For manifest v3
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker)
      serviceWorker = await context.waitForEvent('serviceworker');
    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
```

### Use Fixtures in Tests

```typescript
import { test, expect } from './fixtures';

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('body')).toHaveText('Changed by my-extension');
});

test('popup page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);
  await expect(page.locator('body')).toHaveText('my-extension popup');
});
```

## Headless Mode

Use `channel: 'chromium'` to run extensions in headless mode. Alternatively, launch the browser in headed mode.

**Important:** Google Chrome and Microsoft Edge have removed command-line flags needed to side-load extensions. Use the bundled Chromium.

## Best Practices

- Use bundled Chromium, not branded Chrome or Edge
- Use `launchPersistentContext` for extension testing
- Create test fixtures for reusable extension setup
- Retrieve extension ID dynamically from service worker URL
- Handle service worker suspension in MV3 extensions
