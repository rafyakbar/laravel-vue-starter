# API Testing

> Source: https://playwright.dev/docs/api-testing

## Background

Playwright can be used to get access to the REST API of your application. This is useful for testing server API, preparing server side state before visiting the web application, and validating server side post-conditions after running browser actions.

## Writing API Tests

### Configuration

Configure `baseURL` and headers for all requests:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  use: {
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  },
});
```

### Proxy Configuration

```typescript
export default defineConfig({
  use: {
    proxy: {
      server: 'http://my-proxy:8080',
      username: 'user',
      password: 'secret'
    },
  },
});
```

### Basic Tests

```typescript
const REPO = 'test-repo-1';
const USER = 'github-username';

test('should create a bug report', async ({ request }) => {
  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: '[Bug] report 1',
      body: 'Bug description',
    }
  });
  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(expect.objectContaining({
    title: '[Bug] report 1',
    body: 'Bug description'
  }));
});
```

### Setup and Teardown

```typescript
test.beforeAll(async ({ request }) => {
  const response = await request.post('/user/repos', {
    data: { name: REPO }
  });
  expect(response.ok()).toBeTruthy();
});

test.afterAll(async ({ request }) => {
  const response = await request.delete(`/repos/${USER}/${REPO}`);
  expect(response.ok()).toBeTruthy();
});
```

## Using Request Context

Create a standalone request context for more control:

```typescript
import { request } from '@playwright/test';

(async () => {
  const context = await request.newContext({
    baseURL: 'https://api.github.com',
  });

  await context.post('/user/repos', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
    data: { name: REPO }
  });

  await context.delete(`/repos/${USER}/${REPO}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    }
  });
})();
```

## API Requests from UI Tests

### Establishing Preconditions

Create data via API, verify in browser:

```typescript
let apiContext;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  });
});

test.afterAll(async () => {
  await apiContext.dispose();
});

test('last created issue should be first in the list', async ({ page }) => {
  const newIssue = await apiContext.post(`/repos/${USER}/${REPO}/issues`, {
    data: { title: '[Feature] request 1' }
  });
  expect(newIssue.ok()).toBeTruthy();

  await page.goto(`https://github.com/${USER}/${REPO}/issues`);
  const firstIssue = page.locator("a[data-hovercard-type='issue']").first();
  await expect(firstIssue).toHaveText('[Feature] request 1');
});
```

### Validating Postconditions

Create data in browser, verify via API:

```typescript
test('last created issue should be on the server', async ({ page }) => {
  await page.goto(`https://github.com/${USER}/${REPO}/issues`);
  await page.getByText('New Issue').click();
  await page.getByRole('textbox', { name: 'Title' }).fill('Bug report 1');
  await page.getByRole('textbox', { name: 'Comment body' }).fill('Bug description');
  await page.getByText('Submit new issue').click();

  const issueId = new URL(page.url()).pathname.split('/').pop();
  const newIssue = await apiContext.get(
    `https://api.github.com/repos/${USER}/${REPO}/issues/${issueId}`
  );
  expect(newIssue.ok()).toBeTruthy();
  expect(newIssue.json()).toEqual(expect.objectContaining({
    title: 'Bug report 1'
  }));
});
```

## Reusing Authentication State

Transfer authentication state between API and browser contexts:

```typescript
const requestContext = await request.newContext({
  httpCredentials: { username: 'user', password: 'passwd' }
});
await requestContext.get('https://api.example.com/login');

// Save storage state
await requestContext.storageState({ path: 'state.json' });

// Create browser context with saved state
const context = await browser.newContext({ storageState: 'state.json' });
```

## Context Request vs Global Request

### Context Request

`context.request` and `page.request` share cookie storage with the browser context:

```typescript
// API response cookies automatically update browser context
const response = await context.request.fetch(route.request());
```

### Global Request

`playwright.request.newContext()` creates isolated cookie storage:

```typescript
const request = await playwright.request.newContext();
// This request has its own isolated cookies

// Export storage to a new context
const storageState = await request.storageState();
const browserContext = await browser.newContext({ storageState });
```

## Best Practices

- Use `baseURL` to simplify API endpoints in tests
- Set up request context in `beforeAll` for reuse across tests
- Dispose request context in `afterAll` to clean up resources
- Combine API and UI tests: prepare state via API, verify via UI
- Use context request when you need shared cookies with browser
- Use global request when you need isolated cookie storage
- Configure proxy settings for tests behind corporate firewalls
