# Debugging Tests

> Source: https://playwright.dev/docs/debug

## Background

Playwright provides multiple tools for debugging tests including VS Code extension integration, Playwright Inspector, Trace Viewer, and Browser Developer Tools.

## VS Code Debugger

The VS Code Extension provides the best debugging experience with error messages, breakpoints, and live debugging.

### Error Messages

VS Code shows error messages in the editor with expected vs received values and a complete call log.

### Live Debugging

After running with "Show Browser" enabled, click on locators in VS Code to highlight them in the browser. Edit locators to see changes live.

### Picking a Locator

Click the Pick Locator button, then click an element in the browser. The locator appears in VS Code - press Enter to copy.

### Run in Debug Mode

Set breakpoints by clicking next to line numbers. Right-click a test and select "Debug Test".

### Debug in Different Browsers

Right-click the debug icon, select "Select Default Profile", and choose the browser profile.

## Playwright Inspector

A GUI tool to step through tests, live edit locators, pick locators, and see actionability logs.

### Run in Debug Mode

```bash
# Debug all tests
npx playwright test --debug

# Debug one test on specific line
npx playwright test example.spec.ts:10 --debug

# Debug on specific browser
npx playwright test --project=chromium --debug
npx playwright test --project="Mobile Safari" --debug
```

### Stepping Through Tests

Use the toolbar to play, pause, or step through each action. The current action is highlighted in code and matching elements in the browser.

### Run from Specific Breakpoint

Add `page.pause()` to your test:

```typescript
await page.pause();
```

Run with `--debug` flag. The test stops at `page.pause()`.

### Live Editing Locators

Edit locators in the Pick Locator field while debugging - matching elements highlight in the browser.

### Actionability Logs

View logs showing element visibility, enabled state, scrolling, and other checks.

## Trace Viewer

Explore recorded traces of tests. Go back and forward through actions, see DOM snapshots, view details like time, parameters, and logs.

## Browser Developer Tools

When running with `PWDEBUG=console`, a `playwright` object is available in DevTools console.

```bash
PWDEBUG=console npx playwright test
```

### Available Commands

```javascript
// Query selector
playwright.$('.auth-form >> text=Log in')

// Query all matching elements
playwright.$$('li >> text=John')

// Inspect element
playwright.inspect('text=Log in')

// Create locator
playwright.locator('.auth-form', { hasText: 'Log in' })

// Generate selector for element
playwright.selector($0)
```

## Verbose API Logs

Enable verbose logging with `DEBUG` environment variable:

```bash
DEBUG=pw:api npx playwright test
```

## Headed Mode

Run browsers in headed mode with slow motion:

```typescript
await chromium.launch({ headless: false, slowMo: 100 });
```

## Best Practices

- Use VS Code extension for the best debugging experience
- Add `page.pause()` to stop at specific points
- Use Trace Viewer for CI failures
- Pick locators using the inspector for resilient selectors
- Check actionability logs to understand test behavior
- Use headed mode with `slowMo` to follow execution
