# Migrating from Puppeteer

> Source: https://playwright.dev/docs/puppeteer

## Background

Playwright offers similar APIs to Puppeteer with added capabilities for cross-browser automation and a powerful test runner. Most Puppeteer APIs transfer directly, making migration straightforward.

## Migration Principles

- Most Puppeteer APIs work as-is
- Prefer `Locator` over `ElementHandle`
- Playwright supports Chromium, Firefox, and WebKit
- Auto-waiting reduces need for explicit waits

## API Mapping Cheat Sheet

| Puppeteer | Playwright |
|-----------|------------|
| `await puppeteer.launch()` | `await playwright.chromium.launch()` |
| `puppeteer.launch({product: 'firefox'})` | `await playwright.firefox.launch()` |
| WebKit not supported | `await playwright.webkit.launch()` |
| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)` |
| `await page.setViewport(...)` | `await page.setViewportSize(...)` |
| `await page.waitForXPath(XPathSelector)` | `await page.waitForSelector(XPathSelector)` |
| `await page.waitForNetworkIdle(...)` | `await page.waitForLoadState('networkidle')` |
| `await page.$eval(...)` | Use assertions instead |
| `await page.$(...)` | Discouraged, use Locators |
| `await page.$x(xpath_selector)` | Discouraged, use Locators |
| Checkbox/radio dedicated methods | `await page.locator(selector).check()` |
| `await page.click(selector)` | `await page.locator(selector).click()` |
| `await page.type(selector, ...)` | `await page.locator(selector).fill(...)` |
| `await page.waitForFileChooser(...)` | `await page.locator(selector).setInputFiles(...)` |
| `await page.cookies([...urls])` | `await browserContext.cookies([urls])` |
| `await page.deleteCookie(...cookies)` | `await browserContext.clearCookies()` |

## Automation Example

### Puppeteer

```typescript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://playwright.dev/', {
    waitUntil: 'networkidle2',
  });
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

### Playwright

```typescript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://playwright.dev/', {
    waitUntil: 'networkidle',
  });
  await page.screenshot({ path: 'example.png' });
  await browser.close();
})();
```

## Test Example

### Puppeteer with Jest

```typescript
import puppeteer from 'puppeteer';

describe('Playwright homepage', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  it('contains hero title', async () => {
    await page.goto('https://playwright.dev/');
    await page.waitForSelector('.hero__title');
    const text = await page.$eval('.hero__title', e => e.textContent);
    expect(text).toContain('Playwright enables reliable end-to-end testing');
  });

  afterAll(() => browser.close());
});
```

### Playwright Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Playwright homepage', () => {
  test('contains hero title', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    const titleLocator = page.locator('.hero__title');
    await expect(titleLocator).toContainText(
      'Playwright enables reliable end-to-end testing'
    );
  });
});
```

## Key Migration Notes

1. Import from `playwright` package with explicit browser choice
2. Use browser contexts for state isolation
3. `setViewport` becomes `setViewportSize`
4. `networkidle2` becomes `networkidle`
5. Use assertions instead of `page.$eval()` for verification

## Playwright Test Advantages

- Zero-configuration TypeScript support
- Cross-browser testing on all major engines
- Full support for iframes, tabs, and contexts
- Parallel execution with test isolation
- Built-in artifact collection
- Playwright Inspector for debugging
- Code generation with test recorder
- Tracing for post-mortem debugging

## Best Practices

- Use Locators for auto-waiting and retry-ability
- Leverage web-first assertions
- Let auto-waiting handle synchronization
- Use browser contexts for test isolation
- Take advantage of the test runner's parallelism
- Enable tracing for debugging capabilities
