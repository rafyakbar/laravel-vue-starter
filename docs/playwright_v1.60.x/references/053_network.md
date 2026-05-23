# Network

> Source: https://playwright.dev/docs/network

## Background

Playwright provides APIs to monitor and modify browser network traffic, both HTTP and HTTPS. Any requests including XHRs and fetch can be tracked, modified, and handled.

## Network Mocking

Block requests:

```typescript
test.beforeEach(async ({ context }) => {
  // Block css requests for each test
  await context.route(/\.css$/, route => route.abort());
});

test('loads page without images', async ({ page }) => {
  // Block png and jpeg images
  await page.route(/(png|jpeg)$/, route => route.abort());
  await page.goto('https://playwright.dev');
});
```

## HTTP Authentication

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    httpCredentials: {
      username: 'bill',
      password: 'pa55w0rd',
    }
  }
});
```

## HTTP Proxy

```typescript
export default defineConfig({
  use: {
    proxy: {
      server: 'http://myproxy.com:3128',
      username: 'usr',
      password: 'pwd'
    }
  }
});
```

Per context:

```typescript
const context = await browser.newContext({
  proxy: { server: 'http://myproxy.com:3128' }
});
```

## Network Events

Monitor requests and responses:

```typescript
page.on('request', request => console.log('>>', request.method(), request.url()));
page.on('response', response => console.log('<<', response.status(), response.url()));
await page.goto('https://example.com');
```

Wait for response:

```typescript
const responsePromise = page.waitForResponse('**/api/fetch_data');
await page.getByText('Update').click();
const response = await responsePromise;
```

## Handle Requests

Fulfill with mock data:

```typescript
await page.route('**/api/fetch_data', route => route.fulfill({
  status: 200,
  body: testData,
}));
```

## Modify Requests

```typescript
// Delete header
await page.route('**/*', async route => {
  const headers = route.request().headers();
  delete headers['X-Secret'];
  await route.continue({ headers });
});

// Change method
await page.route('**/*', route => route.continue({ method: 'POST' }));
```

## Abort Requests

```typescript
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// Abort based on request type
await page.route('**/*', route => {
  return route.request().resourceType() === 'image'
    ? route.abort()
    : route.continue();
});
```

## Modify Responses

```typescript
await page.route('**/title.html', async route => {
  const response = await route.fetch();
  let body = await response.text();
  body = body.replace('<title>', '<title>My prefix:');
  await route.fulfill({ response, body });
});
```

## Glob URL Patterns

- `*` matches any characters except `/`
- `**` matches any characters including `/`
- `?` matches only question mark
- `{a,b}` matches a or b

Examples:
- `**/*.js` - matches all JS files
- `**/*.{png,jpg,jpeg}` - matches all images

## WebSockets

```typescript
page.on('websocket', ws => {
  console.log(`WebSocket opened: ${ws.url()}>`);
  ws.on('framesent', event => console.log(event.payload));
  ws.on('framereceived', event => console.log(event.payload));
  ws.on('close', () => console.log('WebSocket closed'));
});
```

## Best Practices

- Use `context.route()` for routes applying to all pages
- Use `page.route()` for page-specific mocking
- Block Service Workers with `serviceWorkers: 'block'` if events are missing
- Use glob patterns for flexible URL matching
