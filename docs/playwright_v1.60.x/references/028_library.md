# Library

> Source: https://playwright.dev/docs/library

## Background

Playwright Library provides unified APIs for launching and interacting with browsers, while Playwright Test provides all this plus a fully managed end-to-end Test Runner. For end-to-end testing, use `@playwright/test` (Playwright Test), not `playwright` (Playwright Library) directly.

## Key Differences: Library vs Test Runner

| Aspect | Library | Test Runner |
|--------|---------|-------------|
| Installation | `npm install playwright` | `npm init playwright@latest` |
| Browser install | `@playwright/browser-chromium`, etc. | `npx playwright install` |
| Import from | `playwright` | `@playwright/test` |
| Initialization | Manual: launch browser, create context, create page | Automatic fixtures provided |
| Assertions | No built-in Web-First Assertions | `expect(page).toHaveTitle()` |
| Timeouts | 30s default for operations | Test timeout (30s default) |
| Cleanup | Manual close of context and browser | Automatic cleanup |
| Running | `node my-script.js` | `npx playwright test` |

## Installation

```bash
npm i -D playwright
```

Download browsers:

```bash
# Download Chromium, Firefox and WebKit
npx playwright install chromium firefox webkit

# Or add packages that download on npm install
npm i -D @playwright/browser-chromium @playwright/browser-firefox @playwright/browser-webkit
```

## Library Example

Using Playwright Library directly:

```typescript
import { chromium, devices } from 'playwright';
import assert from 'node:assert';

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext(devices['iPhone 11']);
  const page = await context.newPage();

  // The actual test
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');
  assert(await page.title() === 'Example Domain'); // Not a Web First assertion

  // Teardown
  await context.close();
  await browser.close();
})();
```

Run with `node my-script.js`.

## Test Runner Example

Equivalent test using Playwright Test:

```typescript
import { expect, test, devices } from '@playwright/test';
test.use(devices['iPhone 11']);
test('should be titled', async ({ page, context }) => {
  await context.route('**.jpg', route => route.abort());
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle('Example');
});
```

Run with `npx playwright test`.

## First Script

Navigate to a URL and take a screenshot:

```javascript
const { webkit } = require('playwright');

(async () => {
  const browser = await webkit.launch();
  const page = await browser.newPage();
  await page.goto('https://playwright.dev/');
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

### Headed Mode

By default, browsers run headless. To see the browser UI:

```javascript
firefox.launch({ headless: false, slowMo: 50 });
```

## Record Scripts

Use command line tools to record user interactions:

```bash
npx playwright codegen wikipedia.org
```

## Browser Downloads

### Download Behind Proxy

Pass `HTTPS_PROXY` environment variable:

```bash
HTTPS_PROXY=https://192.0.2.1 npx playwright install
```

### Download from Artifact Repository

Pass `PLAYWRIGHT_DOWNLOAD_HOST`:

```bash
PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npx playwright install
```

### Skip Browser Download

Set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`:

```bash
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install
```

## TypeScript Support

Playwright includes built-in TypeScript support.

### In JavaScript

Add to the top of your file for type-checking:

```javascript
// @ts-check
// ...
```

Or use JSDoc:

```javascript
/** @type {import('playwright').Page} */
let page;
```

### In TypeScript

Types work out-of-the-box and can be imported explicitly:

```typescript
let page: import('playwright').Page;
```

## Test Runner Advantages

Playwright Test includes:
- Configuration Matrix and Projects
- Parallelization
- Web-First Assertions
- Reporting
- Retries
- Easily Enabled Tracing

## Best Practices

- Use Playwright Test (`@playwright/test`) for end-to-end testing, not the Library directly
- Use `@ts-check` in JavaScript files for type-checking
- Keep browser binaries updated with `npx playwright install --with-deps`
- Use `slowMo` option for debugging headed mode
- Set environment variables for proxy or custom artifact repositories
