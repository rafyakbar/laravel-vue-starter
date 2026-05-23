# Trace Viewer Introduction

> Source: https://playwright.dev/docs/trace-viewer-intro

## Background

Playwright Trace Viewer is a GUI tool that lets you explore recorded Playwright traces of your tests, meaning you can go back and forward through each action of your test and visually see what was happening during each action.

## Recording a Trace

By default the `playwright.config` file contains the configuration needed to create a `trace.zip` file for each test. Traces are setup to run `on-first-retry`, meaning they run on the first retry of a failed test. Also `retries` are set to 2 when running on CI and 0 locally.

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: process.env.CI ? 2 : 0, // set to 2 when running on CI
  // ...
  use: {
    trace: 'on-first-retry', // record traces on first retry of each test
  },
});
```

Traces are normally run in a Continuous Integration (CI) environment, because locally you can use UI Mode for developing and debugging tests. However, if you want to run traces locally without using UI Mode, you can force tracing to be on:

```bash
npx playwright test --trace on
```

## Opening the HTML Report

The HTML report shows you a report of all your tests that have been run and on which browsers as well as how long they took. Tests can be filtered by passed tests, failed, flaky, or skipped tests. You can also search for a particular test.

```bash
npx playwright show-report
```

Clicking on a test opens the detailed view where you can see more information on your tests such as the errors, the test steps, and the trace.

## Opening the Trace

In the HTML report, click on the trace icon next to the test file name to directly open the trace for the required test.

You can also click to open the detailed view of the test and scroll down to the `'Traces'` tab and open the trace by clicking on the trace screenshot.

## Viewing the Trace

View traces of your test by clicking through each action or hovering using the timeline and see the state of the page before and after the action. Inspect the log, source and network, errors, and console during each step of the test. The trace viewer creates a DOM snapshot so you can fully interact with it and open the browser DevTools to inspect the HTML, CSS, etc.

## Best Practices

- Use `on-first-retry` trace mode for CI efficiency
- Enable traces locally only when debugging specific issues
- Leverage the timeline view to understand test timing
- Use DOM snapshots to inspect page state at each step
- Check network requests to diagnose API-related failures
