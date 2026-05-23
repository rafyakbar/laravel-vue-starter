# Service Workers

> Source: https://playwright.dev/docs/service-workers

## Background

Service Workers provide a browser-native method for handling network requests, enabling caching logic and offline experiences. Playwright supports testing applications that use Service Workers, with specific APIs for inspection and control.

Note: Service Workers are only supported in Chromium-based browsers.

## Disabling Service Workers

Disable Service Workers during testing for more predictable and performant tests:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    serviceWorkers: 'block',  // or 'allow' (default)
  },
});
```

## Accessing Service Workers

List active Service Workers or wait for registration:

```typescript
// Wait for service worker registration
const serviceWorkerPromise = context.waitForEvent('serviceworker');
await page.goto('/example-with-a-service-worker.html');
const serviceworker = await serviceWorkerPromise;
```

## Waiting for Activation

Service workers must be activated before evaluating in them:

```typescript
await page.evaluate(async () => {
  const registration = await window.navigator.serviceWorker.getRegistration();
  if (registration.active?.state === 'activated')
    return;
  await new Promise(resolve => {
    window.navigator.serviceWorker.addEventListener('controllerchange', resolve);
  });
});
```

## Network Events

Service Worker requests are reported through BrowserContext events:

- `browserContext.on('request')` - fired for all requests
- `browserContext.on('requestfinished')` - fired when request completes
- `browserContext.on('response')` - fired when response is received
- `browserContext.on('requestfailed')` - fired when request fails

Check if a request came from a Service Worker:

```typescript
// response.fromServiceWorker() returns true when handled by SW
const handledBySW = response.fromServiceWorker();
```

## Routing Service Worker Requests

Intercept requests made by Service Workers:

```typescript
await context.route('**', async route => {
  if (route.request().serviceWorker()) {
    // This request is from a Service Worker
    await route.fulfill({
      contentType: 'text/plain',
      status: 200,
      body: 'from sw',
    });
  } else {
    await route.continue();
  }
});
```

## Known Limitations

- Requests for updated Service Worker main script code cannot be routed
- Calling `request.frame()` on Service Worker requests will throw an exception
- Service Workers are only supported in Chromium-based browsers

## Best Practices

- Block Service Workers in tests that don't need them for better performance
- Wait for Service Worker activation before relying on cached content
- Use the Network guide for general request mocking instead of Service Worker manipulation
- Test both with and without Service Workers enabled for comprehensive coverage
