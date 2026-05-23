# Release Notes

> Source: https://playwright.dev/docs/release-notes

## Background

Playwright release notes document new features, API changes, improvements, and breaking changes for each version. This page covers releases from v1.60 down to v1.12.

## Version 1.60 Highlights

### HAR Recording on Tracing

The `tracing.startHar()` and `tracing.stopHar()` methods expose HAR recording as a first-class tracing API with `content`, `mode`, and `urlFilter` options. The returned Disposable makes it easy to scope a recording with `await using`:

```typescript
await using har = await context.tracing.startHar('trace.har');
const page = await context.newPage();
await page.goto('https://playwright.dev');
// HAR is finalized when `har` goes out of scope
```

### Drop API

The new `locator.drop()` method simulates an external drag-and-drop of files or clipboard-like data onto an element:

```typescript
await page.locator('#dropzone').drop({
  files: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') },
});

await page.locator('#dropzone').drop({
  data: {
    'text/plain': 'hello world',
    'text/uri-list': 'https://example.com',
  },
});
```

### Aria Snapshots

- `expect(page).toMatchAriaSnapshot()` now works on a Page (equivalent to asserting against `page.locator('body')`)
- New `boxes` option on `locator.ariaSnapshot()` / `page.ariaSnapshot()` appends each element's bounding box

### test.abort()

New `test.abort()` aborts the currently running test from a fixture, hook, or route handler:

```typescript
test('does not publish to the shared page', async ({ page }) => {
  await page.route('**/publish', route => {
    test.abort('Tests must not publish to the shared page.');
    return route.abort();
  });
});
```

## Version 1.59 Highlights

### Screencast API

New `page.screencast` API provides unified interface for capturing page content with recordings, action annotations, visual overlays, and real-time frame capture:

```typescript
await page.screencast.start({ path: 'video.webm' });
await page.screencast.showActions({ position: 'top-right' });
await page.screencast.showChapter('Adding TODOs', { description: 'Type and press enter' });
```

### Interoperability

New `browser.bind()` API makes a launched browser available for `playwright-cli`, `@playwright/mcp`, and other clients to connect to.

### await using Syntax

Many APIs now return async disposables, enabling `await using` syntax for automatic cleanup:

```typescript
await using page = await context.newPage();
{
  await using route = await page.route('**/*', route => route.continue());
  await using script = await page.addInitScript('console.log("init")');
  await page.goto('https://playwright.dev');
}
```

## Version 1.58 Highlights

### Timeline in HTML Report

The HTML report Speedboard tab now shows the Timeline for merged reports.

### UI Mode and Trace Viewer Improvements

- New 'system' theme option follows OS dark/light mode preference
- Search functionality (Cmd/Ctrl+F) available in code editors
- Network details panel reorganized for better usability

## Version 1.57 Highlights

### Speedboard

The HTML reporter includes a new "Speedboard" tab showing all executed tests sorted by slowness.

### Chrome for Testing

Playwright now runs on Chrome for Testing builds rather than Chromium.

### Waiting for Webserver Output

`testConfig.webServer` added a `wait` field for waiting until webserver logs match a pattern:

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run start',
    wait: { stdout: /Listening on port (?<my_server_port>\d+)/ },
  },
});
```

## Version 1.56 Highlights

### Playwright Test Agents

Introducing three custom agent definitions:
- 🎭 planner explores the app and produces a Markdown test plan
- 🎭 generator transforms the Markdown plan into Playwright Test files
- 🎭 healer executes tests and automatically repairs failing tests

## Best Practices

- Review release notes before upgrading to understand breaking changes
- Test upgrades in a separate branch before deploying to production
- Use `npx playwright test --list` to verify tests still work after upgrading
- Keep Playwright and browser versions in sync for optimal compatibility
