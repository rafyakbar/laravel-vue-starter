# Visual Comparisons

> Source: https://playwright.dev/docs/test-snapshots

## Background

Playwright Test includes visual comparison capabilities through `toHaveScreenshot()`. This assertion captures screenshots and compares them against reference images, making it easy to detect visual regressions in your application.

## Basic Usage

```typescript
import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot();
});
```

## Generating Screenshots

On first run, the test creates a reference screenshot:

```
Error: A snapshot doesn't exist at example.spec.ts-snapshots/example-test-1-chromium-darwin.png, writing actual.
```

Add the generated snapshot to version control.

## Screenshot Naming

Snapshots are named with:
- Auto-generated name from test title, or custom name
- Browser name and platform (e.g., `chromium-darwin`)

Specify a custom name:

```typescript
await expect(page).toHaveScreenshot('landing.png');
```

## Configuration Options

### Tolerance Settings

Allow pixel differences:

```typescript
await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
```

Configure globally:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  expect: {
    toHaveScreenshot: { maxDiffPixels: 100 },
  },
});
```

### Custom Styling

Apply CSS during screenshot capture to hide dynamic elements:

```typescript
// screenshot.css
iframe { visibility: hidden; }

// test file
await expect(page).toHaveScreenshot({
  stylePath: path.join(__dirname, 'screenshot.css')
});
```

## Updating Screenshots

Update reference screenshots when UI changes intentionally:

```bash
npx playwright test --update-snapshots
```

## Non-Image Snapshots

Compare text or arbitrary data:

```typescript
import { test, expect } from '@playwright/test';

test('text snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev');
  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');
});
```

## Snapshot Storage

Snapshots are stored in `<test-file>-snapshots/` directories:

```
example.spec.ts
example.spec.ts-snapshots/
  ├── example-test-1-chromium-darwin.png
  └── hero.txt
```

Commit the snapshots directory to version control.

## Custom Snapshot Path

Configure snapshot location:

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      pathTemplate: '__snapshots__/{testFilePath}/{arg}{ext}',
    },
  },
});
```

## Cross-Platform Considerations

Screenshots can differ between:
- Operating systems (fonts, rendering)
- Browsers (different engines)
- Hardware (GPU rendering)
- Headless vs headed mode

Run tests in the same environment where baseline screenshots were generated for consistent results.

## Best Practices

- Store screenshots in version control
- Review snapshot diffs carefully before updating
- Use a consistent test environment for baseline generation
- Hide dynamic elements with `stylePath` for deterministic screenshots
- Set appropriate `maxDiffPixels` for your application
- Run visual tests in CI with the same environment as local development
- Use descriptive names for easier maintenance
