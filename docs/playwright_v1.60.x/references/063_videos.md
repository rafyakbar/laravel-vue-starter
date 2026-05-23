# Videos

> Source: https://playwright.dev/docs/videos

## Background

Playwright can record videos of test execution, useful for debugging failed tests and documenting test behavior. Videos are captured at the browser context level and saved upon context closure.

## Enabling Video Recording

Configure video recording in your Playwright config:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
});
```

## Video Modes

- `'off'`: Never record video (default)
- `'on'`: Record video for every test
- `'retain-on-failure'`: Record all, delete videos from passing tests
- `'on-first-retry'`: Record only on first test retry

## Video Configuration

Customize video size and annotations:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    video: {
      mode: 'on-first-retry',
      size: { width: 640, height: 480 },
      show: {
        actions: {
          duration: 500,
          position: 'top-right',
          fontSize: 14,
        },
        test: {
          level: 'step',
          position: 'top-left',
          fontSize: 12,
        }
      },
    },
  },
});
```

## Accessing Video Path

Get the video file path after recording:

```typescript
const path = await page.video().path();
```

Note: The video is only available after the page or browser context is closed.

## Video Size

The video size defaults to the viewport size scaled down to fit 800x800. Set a specific size for consistent recordings:

```typescript
use: {
  video: {
    mode: 'on',
    size: { width: 1280, height: 720 }
  }
}
```

## Video Annotations

When `show: { actions }` is specified, each action is visually highlighted in the video with element outlines and action subtitles. The `duration` property controls how long each annotation displays (default 500ms).

When `show: { test }` is specified, the video includes current test information annotations.

## Storage Location

Videos are saved to the test output directory, typically `test-results/`. Each test run creates separate video files.

## Best Practices

- Use `'on-first-retry'` or `'retain-on-failure'` to minimize storage
- Set a fixed video size for consistent recordings across runs
- Match viewport size to video size for optimal quality
- Include video artifacts in CI for debugging failed tests
- Clean up old video files regularly to manage storage
- Consider video size when running large test suites
