# WebView2

> Source: https://playwright.dev/docs/webview2

## Background

Playwright can automate Microsoft Edge WebView2 applications using Chrome DevTools Protocol (CDP). WebView2 is a WinForms control that renders web content using Microsoft Edge, available on Windows 10 and 11.

## Overview

Enable CDP connections in WebView2 by setting the `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` environment variable or using `EnsureCoreWebView2Async` with remote debugging port:

```csharp
await this.webView.EnsureCoreWebView2Async(
  await CoreWebView2Environment.CreateAsync(null, null, 
    new CoreWebView2EnvironmentOptions() {
      AdditionalBrowserArguments = "--remote-debugging-port=9222"
    }
  )
).ConfigureAwait(false);
```

## Connecting to WebView2

Once the application is running with CDP enabled:

```typescript
const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');
const context = browser.contexts()[0];
const page = context.pages()[0];
```

## Writing Tests

Create a custom test fixture for WebView2 testing:

```typescript
// webView2Test.ts
import { test as base } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import childProcess from 'child_process';

const EXECUTABLE_PATH = path.join(
  __dirname,
  '../../webview2-app/bin/Debug/net8.0-windows/webview2.exe'
);

export const test = base.extend({
  browser: async ({ playwright }, use, testInfo) => {
    const cdpPort = 10000 + testInfo.workerIndex;
    fs.accessSync(EXECUTABLE_PATH, fs.constants.X_OK);
    
    const userDataDir = path.join(
      fs.realpathSync.native(os.tmpdir()),
      `playwright-webview2-tests/user-data-dir-${testInfo.workerIndex}`
    );
    
    const webView2Process = childProcess.spawn(EXECUTABLE_PATH, [], {
      shell: true,
      env: {
        ...process.env,
        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${cdpPort}`,
        WEBVIEW2_USER_DATA_FOLDER: userDataDir,
      }
    });
    
    await new Promise<void>(resolve => webView2Process.stdout.on('data', data => {
      if (data.toString().includes('WebView2 initialized'))
        resolve();
    }));
    
    const browser = await playwright.chromium.connectOverCDP(`http://127.0.0.1:${cdpPort}`);
    await use(browser);
    await browser.close();
    childProcess.execSync(`taskkill /pid ${webView2Process.pid} /T /F`);
    fs.rmdirSync(userDataDir, { recursive: true });
  },
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0];
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0];
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Test Example

```typescript
// example.spec.ts
import { test, expect } from './webView2Test';

test('test WebView2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const getStarted = page.getByText('Get Started');
  await expect(getStarted).toBeVisible();
});
```

## User Data Directory

Each test should use a unique user data directory to prevent interference:

```typescript
WEBVIEW2_USER_DATA_FOLDER: `/path/to/unique/directory/${testInfo.workerIndex}`
```

## Debugging

Open DevTools in WebView2 by:
- Right-clicking and selecting "Inspect"
- Pressing F12
- Calling `CoreWebView2.OpenDevToolsWindow()` programmatically

For test debugging, see the Playwright Debugging guide.

## Best Practices

- Use unique user data directories per test for isolation
- Wait for WebView2 initialization before running tests
- Clean up processes and directories after tests complete
- Handle the asynchronous nature of WebView2 initialization
- Test in both debug and release builds of your WebView2 application
