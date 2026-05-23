# Configuration (use)

> Source: https://playwright.dev/docs/test-use-options

## Background

In addition to configuring the test runner, you can configure Emulation, Network, and Recording options for the Browser or BrowserContext. These options are passed to the `use: {}` object in the Playwright config.

## Basic Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Base URL for page.goto('/')
    baseURL: 'http://localhost:3000',
    
    // Populates context with given storage state
    storageState: 'state.json',
  },
});
```

## Emulation Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Emulates 'prefers-colors-scheme' media feature
    colorScheme: 'dark',
    
    // Context geolocation
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    
    // Emulates the user locale
    locale: 'en-GB',
    
    // Grants specified permissions
    permissions: ['geolocation'],
    
    // Emulates the user timezone
    timezoneId: 'Europe/Paris',
    
    // Viewport for all pages
    viewport: { width: 1280, height: 720 },
  },
});
```

## Network Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Whether to automatically download attachments
    acceptDownloads: false,
    
    // Additional HTTP headers
    extraHTTPHeaders: {
      'X-My-Header': 'value',
    },
    
    // Credentials for HTTP authentication
    httpCredentials: {
      username: 'user',
      password: 'pass',
    },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Emulate network offline
    offline: true,
    
    // Proxy settings
    proxy: {
      server: 'http://myproxy.com:3128',
      bypass: 'localhost',
    },
  },
});
```

## Recording Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Capture screenshot after each test failure
    screenshot: 'only-on-failure',
    
    // Record trace when retrying a test
    trace: 'on-first-retry',
    
    // Record video when retrying a test
    video: 'on-first-retry',
  },
});
```

## Other Options

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Maximum time each action can take
    actionTimeout: 0,
    
    // Browser name (chromium, firefox, webkit)
    browserName: 'chromium',
    
    // Bypass Content-Security-Policy
    bypassCSP: true,
    
    // Browser channel (chrome, chrome-beta, msedge)
    channel: 'chrome',
    
    // Run browser in headless mode
    headless: false,
    
    // Change default data-testid attribute
    testIdAttribute: 'pw-test-id',
  },
});
```

## Configuration Scopes

Override options globally, per project, or per test:

```typescript
// Global config
export default defineConfig({
  use: { locale: 'en-GB' },
});

// Per project
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], locale: 'de-DE' },
    },
  ],
});

// Per test file
test.use({ locale: 'fr-FR' });
```

## Best Practices

- Use `baseURL` to simplify navigation in tests
- Enable `trace: 'on-first-retry'` for debugging failed tests
- Set `viewport` and `colorScheme` to match your target audience
- Configure `storageState` for authenticated tests
