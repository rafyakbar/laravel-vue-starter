# Web Server

> Source: https://playwright.dev/docs/test-webserver

## Background

Playwright comes with a `webServer` option in the config file which gives you the ability to launch a local dev server before running your tests. This is ideal for writing tests during development when you don't have a staging or production URL to test against.

## Configuration

Use the `webServer` property in your Playwright config to launch a development web server during tests:

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
```

### Configuration Options

| Option | Description |
|--------|-------------|
| `command` | Shell command to start the local dev server |
| `cwd` | Current working directory of the spawned process |
| `env` | Environment variables for the command |
| `gracefulShutdown` | How to shut down the process (signal, timeout) |
| `ignoreHTTPSErrors` | Whether to ignore HTTPS errors when fetching the URL |
| `name` | Custom name for the web server (prefixed to log messages) |
| `reuseExistingServer` | Reuse existing server on the port/URL when available |
| `stderr` | Pipe stderr to process stderr or ignore ("pipe" or "ignore") |
| `stdout` | Pipe stdout to process stdout or ignore ("pipe" or "ignore") |
| `timeout` | How long to wait for startup in milliseconds (default: 60000) |
| `url` | URL expected to return 2xx, 3xx, 400, 401, 402, or 403 when ready |
| `wait` | Consider started when given output has been produced |

## Server Timeout

Increase timeout for servers that take longer to boot:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000, // 2 minutes
},
```

## Base URL Configuration

Specify `baseURL` in the `use: {}` section to use relative URLs in tests:

```typescript
export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

Now use relative paths in tests:

```typescript
import { test } from '@playwright/test';
test('test', async ({ page }) => {
  // This will navigate to http://localhost:3000/login
  await page.goto('./login');
});
```

## Multiple Web Servers

Launch multiple web servers by providing an array of configurations:

```typescript
export default defineConfig({
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      name: 'Frontend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend',
      url: 'http://localhost:3333',
      name: 'Backend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
});
```

## Wait for Output

Use the `wait` option to consider the server started when specific output is produced:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://localhost:3000',
  wait: {
    stdout: /Listening on port (?<my_server_port>\d+)/,
  },
},
```

Named capture groups in the regex are stored in environment variables. The example above stores the port number in `process.env['MY_SERVER_PORT']`.

## Best Practices

- Set `reuseExistingServer: !process.env.CI` to allow local dev server reuse
- Always configure `baseURL` to simplify test navigation
- Use `stdout: 'ignore'` to reduce noise in test output
- Use descriptive names when running multiple web servers
- Configure appropriate timeouts for slow-starting servers
- Use `gracefulShutdown` for Docker containers that require SIGTERM
