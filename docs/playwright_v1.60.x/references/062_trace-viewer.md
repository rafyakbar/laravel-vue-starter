# Trace Viewer

> Source: https://playwright.dev/docs/trace-viewer

## Background

Playwright Trace Viewer is a GUI tool for exploring recorded test traces. It provides a complete timeline of test execution, including browser actions, network requests, console logs, and screenshots, enabling detailed post-mortem debugging.

## Recording Traces

Enable tracing in your configuration:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'on-first-retry',  // or 'on', 'off', 'retain-on-failure'
  },
});
```

Trace modes:
- `'off'`: Never record traces
- `'on'`: Record trace for every test
- `'on-first-retry'`: Record only on first retry
- `'retain-on-failure'`: Record for every test, keep only failures

## Opening Traces

Open traces after test execution:

```bash
# Open the trace viewer
npx playwright show-trace trace.zip

# Open specific trace file
npx playwright show-trace test-results/my-test/trace.zip
```

## Trace Contents

Traces capture comprehensive test data:

- **Actions**: Click, fill, navigate, and all page interactions
- **Network**: All requests and responses with headers and bodies
- **Console**: Browser console messages and errors
- **Screenshots**: Images at each action point
- **Source**: Executed source code with line numbers
- **Timeline**: Visual timeline of all events

## Trace Viewer Features

### Timeline View

Navigate through test execution chronologically. Click any action to see the page state at that moment.

### Action Details

Inspect individual actions:
- Before and after screenshots
- Element selectors used
- Action parameters
- Duration and timing

### Network Panel

View all network activity:
- Request and response headers
- Request and response bodies
- Timing information
- Status codes and errors

### Console Panel

See browser console output filtered by action:
- Log messages
- Errors and warnings
- Filter by message type

### Source Panel

View executed code with highlighting:
- Current line during action
- Call stack information
- Variable inspection

## Programmatic Recording

Manually control tracing in tests:

```typescript
import { test, expect } from '@playwright/test';

test('manual trace control', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });
  
  await page.goto('https://example.com');
  await page.click('button');
  
  // Stop and save trace
  await context.tracing.stop({ path: 'trace.zip' });
});
```

## Trace Options

Configure trace recording:

```typescript
await context.tracing.start({
  screenshots: true,   // Capture screenshots
  snapshots: true,     // Capture DOM snapshots
  sources: true,       // Capture source files
  title: 'My trace',   // Trace title
});
```

## Best Practices

- Use `'on-first-retry'` to minimize storage while debugging failures
- Include traces in CI artifacts for post-failure analysis
- Review traces to identify flaky test patterns
- Use screenshots and snapshots for visual debugging
- Share traces with team members to collaborate on debugging
- Clean up old traces to manage storage
