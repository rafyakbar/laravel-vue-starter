# Browsers

> Source: https://playwright.dev/docs/browsers

## Background

Each version of Playwright needs specific versions of browser binaries. Use the Playwright CLI to install these browsers. Every release updates supported browser versions.

## Install Browsers

```bash
# Install all default browsers
npx playwright install

# Install specific browser
npx playwright install webkit

# See all supported browsers
npx playwright install --help
```

## Install System Dependencies

```bash
# Install system dependencies
npx playwright install-deps

# Install dependencies for specific browser
npx playwright install-deps chromium

# Install browsers and dependencies together
npx playwright install --with-deps chromium
```

## Update Playwright Regularly

```bash
npm install -D @playwright/test@latest
npx playwright install

# Check version
npx playwright --version
```

## Configure Browsers

Run tests on Chromium, WebKit, Firefox, and branded browsers:

```typescript
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
    { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    { name: 'Microsoft Edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
  ],
});
```

### Run Specific Project

```bash
npx playwright test --project=firefox
```

## Chromium

Playwright uses open source Chromium builds by default. Since Chromium is ahead of branded browsers, Playwright supports features before they reach Chrome and Edge.

### Headless Shell

For headless-only testing, skip downloading the full browser:

```bash
npx playwright install --with-deps --only-shell
```

### New Headless Mode

Use `'chromium'` channel for the new headless mode:

```typescript
{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chromium' } }
```

## Google Chrome and Microsoft Edge

Playwright can operate against branded browsers. Available channels: `chrome`, `msedge`, `chrome-beta`, `msedge-beta`, `chrome-dev`, `msedge-dev`, `chrome-canary`, `msedge-canary`.

### Install Branded Browsers

```bash
npx playwright install msedge
```

### When to Use Branded Browsers

- **Regression testing**: Test against publicly available browsers
- **Media codecs**: Chromium lacks some codecs due to licensing
- **Enterprise policy**: Use bundled Chromium if policies interfere

## Firefox

Playwright's Firefox matches recent Firefox Stable. Doesn't work with branded Firefox due to patches.

## WebKit

Playwright's WebKit is derived from the latest WebKit main branch, often before Safari updates. For closest-to-Safari experience, run WebKit on macOS.

## Install Behind Proxy

```bash
HTTPS_PROXY=https://192.0.2.1 npx playwright install
```

For custom CA certificates:

```bash
export NODE_EXTRA_CA_CERTS="/path/to/cert.pem"
```

For slow networks:

```bash
PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000 npx playwright install
```

## Download from Artifact Repository

```bash
PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

Per-browser download hosts:

```bash
PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3 PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install
```

## Managing Browser Binaries

Default cache locations:
- Windows: `%USERPROFILE%\AppData\Local\ms-playwright`
- macOS: `~/Library/Caches/ms-playwright`
- Linux: `~/.cache/ms-playwright`

Custom location:

```bash
PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright install
```

### Hermetic Install

Place binaries in local folder:

```bash
PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install
```

### List Installed Browsers

```bash
npx playwright install --list
```

### Uninstall Browsers

```bash
# Remove current installation's browsers
npx playwright uninstall

# Remove all installations' browsers
npx playwright uninstall --all
```

## Best Practices

- Keep Playwright updated to test on latest browser versions
- Use Linux on CI for cost efficiency
- Only install browsers you need on CI
- Use sharding to speed up CI
- Test across all browsers to ensure compatibility
