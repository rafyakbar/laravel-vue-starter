# Emulation

> Source: https://playwright.dev/docs/emulation

## Background

With Playwright you can test your app on any browser and emulate real devices such as mobile phones or tablets. Playwright simulates browser behavior including `userAgent`, `screenSize`, `viewport`, `hasTouch`, `geolocation`, `locale`, `timezone`, `permissions`, and `colorScheme`.

## Devices

Playwright comes with a registry of device parameters for selected desktop, tablet, and mobile devices:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

## Viewport

Override viewport for specific tests:

```typescript
// In config
export default defineConfig({
  use: {
    viewport: { width: 1280, height: 720 },
  },
});

// In test file
test.use({ viewport: { width: 1600, height: 1200 } });

// Inside describe block
test.describe('specific viewport block', () => {
  test.use({ viewport: { width: 1600, height: 1200 } });
});
```

## isMobile

Whether the meta viewport tag is taken into account and touch events are enabled:

```typescript
export default defineConfig({
  use: {
    isMobile: false,
  },
});
```

## Locale & Timezone

```typescript
export default defineConfig({
  use: {
    // Emulates the browser locale
    locale: 'en-GB',
    
    // Emulates the browser timezone
    timezoneId: 'Europe/Paris',
  },
});
```

## Permissions

Allow app to show system notifications:

```typescript
export default defineConfig({
  use: {
    permissions: ['notifications'],
  },
});
```

Allow notifications for a specific domain:

```typescript
test.beforeEach(async ({ context }) => {
  await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });
});
```

## Geolocation

Grant geolocation permissions and set location:

```typescript
export default defineConfig({
  use: {
    geolocation: { longitude: 12.492507, latitude: 41.889938 },
    permissions: ['geolocation'],
  },
});
```

Change location during test:

```typescript
test('my test with geolocation', async ({ page, context }) => {
  await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });
});
```

## Color Scheme

Emulate `prefers-color-scheme` media feature:

```typescript
export default defineConfig({
  use: {
    colorScheme: 'dark', // or 'light'
  },
});
```

## User Agent

Override the user agent:

```typescript
test.use({ userAgent: 'My user agent' });
```

## Offline

Emulate network being offline:

```typescript
export default defineConfig({
  use: {
    offline: true,
  },
});
```

## JavaScript Disabled

Emulate a scenario where JavaScript is disabled:

```typescript
test.use({ javaScriptEnabled: false });
```

## Best Practices

- Use pre-configured devices for mobile testing
- Define viewport after destructuring devices to override device settings
- Grant only necessary permissions for each test
- Test both light and dark color schemes for UI components
