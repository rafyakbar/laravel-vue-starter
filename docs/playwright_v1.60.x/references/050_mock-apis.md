# Mock APIs

> Source: https://playwright.dev/docs/mock

## Background

Playwright provides APIs to mock and modify network traffic, both HTTP and HTTPS. Any requests including XHRs and fetch can be tracked, modified, and mocked.

## Mock API Requests

Intercept calls and return custom responses without hitting the API:

```typescript
test("mocks a fruit and doesn't call api", async ({ page }) => {
  // Mock the api call before navigating
  await page.route('*/**/api/v1/fruits', async route => {
    const json = [{ name: 'Strawberry', id: 21 }];
    await route.fulfill({ json });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Strawberry')).toBeVisible();
});
```

## Modify API Responses

Perform the request and modify the response:

```typescript
test('gets the json from api and adds a new fruit', async ({ page }) => {
  await page.route('*/**/api/v1/fruits', async route => {
    const response = await route.fetch();
    const json = await response.json();
    json.push({ name: 'Loquat', id: 100 });
    await route.fulfill({ response, json });
  });

  await page.goto('https://demo.playwright.dev/api-mocking');
  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();
});
```

## Mocking with HAR Files

### Record a HAR File

```typescript
// Update: true creates/updates the HAR file
await page.routeFromHAR('./hars/fruit.har', {
  url: '*/**/api/v1/fruits',
  update: true,
});
```

### Replay from HAR

```typescript
// update: false serves from HAR file
await page.routeFromHAR('./hars/fruit.har', {
  url: '*/**/api/v1/fruits',
  update: false,
});
```

### Record HAR with CLI

```bash
npx playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com
```

## Mock WebSockets

Mock entire WebSocket communication:

```typescript
await page.routeWebSocket('wss://example.com/ws', ws => {
  ws.onMessage(message => {
    if (message === 'request')
      ws.send('response');
  });
});
```

Connect to server and modify messages:

```typescript
await page.routeWebSocket('wss://example.com/ws', ws => {
  const server = ws.connectToServer();
  ws.onMessage(message => {
    if (message === 'request')
      server.send('request2');
    else
      server.send(message);
  });
});
```

## Route Methods

| Method | Description |
|--------|-------------|
| `route.fulfill()` | Fulfill with custom response |
| `route.fetch()` | Fetch original response |
| `route.abort()` | Abort the request |
| `route.continue()` | Continue with modifications |

## Best Practices

- Set up mocks before navigating to the page
- Use HAR files for complex mocking scenarios
- Modify responses when you need real data with modifications
- Mock WebSockets for real-time feature testing
