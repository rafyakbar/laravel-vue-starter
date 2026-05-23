# Selenium Grid (Experimental)

> Source: https://playwright.dev/docs/selenium-grid

## Background

Playwright can connect to Selenium Grid Hub running Selenium 4 to launch Chrome or Edge browsers on remote machines. This feature is experimental and may have compatibility risks with future Selenium versions.

## Prerequisites

Before connecting, verify Selenium Grid works with Selenium WebDriver:

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 node your-webdriver-example.js
```

## Starting Selenium Grid

When running distributed Selenium Grid, ensure nodes register with accessible addresses:

```bash
# Start selenium node with hub URL
SE_NODE_GRID_URL="http://<selenium-hub-ip>:4444" java -jar selenium-server-<version>.jar node
```

## Connecting Playwright

Set the `SELENIUM_REMOTE_URL` environment variable:

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 npx playwright test
```

No code changes needed - use `browserType.launch()` as usual.

## Additional Capabilities

Pass custom capabilities for specialized grid configurations:

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 \
SELENIUM_REMOTE_CAPABILITIES="{'mygrid:options':{os:'windows',username:'John',password:'secure'}}" \
npx playwright test
```

## Additional Headers

Provide authentication headers for cloud-based grids:

```bash
SELENIUM_REMOTE_URL=http://<selenium-hub-ip>:4444 \
SELENIUM_REMOTE_HEADERS="{'Authorization':'Basic b64enc'}" \
npx playwright test
```

## Debug Logs

Enable detailed logging for troubleshooting:

```bash
DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 npx playwright test
```

## Using Selenium Docker

### Standalone Mode

Run standalone Selenium container:

```bash
docker run -d -p 4444:4444 --shm-size="2g" \
  -e SE_NODE_GRID_URL="http://localhost:4444" \
  selenium/standalone-chromium:latest
```

Connect Playwright:

```bash
SELENIUM_REMOTE_URL=http://localhost:4444 npx playwright test
```

### Hub and Nodes Mode

Run hub and separate node containers:

```bash
# Start hub
docker run -d -p 4442-4444:4442-4444 --name selenium-hub selenium/hub:4.25.0

# Start node
docker run -d -p 5555:5555 \
  --shm-size="2g" \
  -e SE_EVENT_BUS_HOST=<selenium-hub-ip> \
  -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
  -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
  -e SE_NODE_GRID_URL="http://<selenium-hub-ip>:4444" \
  selenium/node-chromium:4.25.0
```

## Selenium 3 Limitations

Selenium 3 lacks CDP websocket support. Playwright attempts direct connection to grid nodes, which must be accessible from the test machine.

## Known Limitations

- Only Chrome and Edge browsers supported
- Selenium 4 required for full functionality
- Selenium 3 support is best-effort
- Direct node access required for Selenium 3

## Best Practices

- Verify basic WebDriver connectivity first
- Use Selenium 4 for best compatibility
- Set `SE_NODE_GRID_URL` when running nodes
- Include debug logs when reporting issues
- Consider Playwright's native browser management for simpler setups
- Test with a simple script before running full suite
