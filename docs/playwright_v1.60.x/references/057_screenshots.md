# Screenshots

> Source: https://playwright.dev/docs/screenshots

## Background

Playwright provides screenshot capabilities for capturing page or element states during test execution. Screenshots are useful for debugging, documentation, and visual regression testing.

## Basic Screenshot

Capture and save a screenshot to a file:

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

## Full Page Screenshots

Capture the entire scrollable page, not just the visible viewport:

```typescript
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

## Capture to Buffer

Get the screenshot as a buffer for post-processing or passing to diff tools:

```typescript
const buffer = await page.screenshot();
console.log(buffer.toString('base64'));
```

## Element Screenshots

Capture a specific element using the locator's screenshot method:

```typescript
await page.locator('.header').screenshot({ path: 'screenshot.png' });
```

## Screenshot Options

The `screenshot()` method accepts various parameters:

```typescript
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,        // Capture full scrollable page
  clip: {                // Clip to specific area
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  omitBackground: true,  // Hide default white background
  quality: 80,           // JPEG quality (0-100), only for JPEG
  type: 'jpeg',          // 'jpeg' or 'png' (default)
  scale: 'css',          // 'css' or 'device'
  timeout: 30000,        // Maximum time in milliseconds
  animations: 'disabled' // Disable CSS animations
});
```

## Screenshots in Tests

Use screenshots with test assertions:

```typescript
import { test, expect } from '@playwright/test';

test('visual comparison', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Will fail on first run, creating baseline
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## Best Practices

- Use `toHaveScreenshot()` for visual regression testing
- Store screenshots in version control alongside tests
- Disable animations for consistent screenshots
- Use descriptive file names that indicate what's being captured
- Consider viewport size when capturing screenshots
- Run in consistent environments for reproducible results
