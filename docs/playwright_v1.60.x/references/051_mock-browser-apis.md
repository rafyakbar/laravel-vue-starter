# Mock Browser APIs

> Source: https://playwright.dev/docs/mock-browser-apis

## Background

Playwright doesn't provide dedicated automation APIs for experimental or partially supported browser features. You can use mocks to test these behaviors.

## Creating Mocks

Use `page.addInitScript()` to set up mocks before page loading:

```typescript
await page.addInitScript(() => {
  const mockBattery = {
    level: 0.75,
    charging: true,
    chargingTime: 1800,
    dischargingTime: Infinity,
    addEventListener: () => { }
  };
  window.navigator.getBattery = async () => mockBattery;
});
```

## Full Example

```typescript
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.90,
      charging: true,
      chargingTime: 1800,
      dischargingTime: Infinity,
      addEventListener: () => { }
    };
    window.navigator.getBattery = async () => mockBattery;
  });
});

test('show battery status', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.battery-percentage')).toHaveText('90%');
  await expect(page.locator('.battery-status')).toHaveText('Adapter');
});
```

## Mocking Read-Only APIs

Some properties can't be assigned directly. Use `Object.defineProperty`:

```typescript
await page.addInitScript(() => {
  Object.defineProperty(
    Object.getPrototypeOf(navigator),
    'cookieEnabled',
    { value: false }
  );
});
```

## Verifying API Calls

Use `page.exposeFunction()` to log calls:

```typescript
test('log battery calls', async ({ page }) => {
  const log = [];
  await page.exposeFunction('logCall', msg => log.push(msg));

  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.75,
      charging: true,
      chargingTime: 1800,
      dischargingTime: Infinity,
      addEventListener: (name, cb) => logCall(`addEventListener:${name}`)
    };
    window.navigator.getBattery = async () => {
      logCall('getBattery');
      return mockBattery;
    };
  });

  await page.goto('/');
  expect(log).toEqual([
    'getBattery',
    'addEventListener:chargingchange',
    'addEventListener:levelchange'
  ]);
});
```

## Updating Mock State

Create a mock class that fires events:

```typescript
await page.addInitScript(() => {
  class BatteryMock {
    level = 0.10;
    charging = false;
    _levelListeners = [];

    addEventListener(eventName, listener) {
      if (eventName === 'levelchange')
        this._levelListeners.push(listener);
    }

    _setLevel(value) {
      this.level = value;
      this._levelListeners.forEach(cb => cb());
    }
  }

  const mockBattery = new BatteryMock();
  window.navigator.getBattery = async () => mockBattery;
  window.mockBattery = mockBattery;
});

// Update mock in test
await page.evaluate(() => window.mockBattery._setLevel(0.275));
await expect(page.locator('.battery-percentage')).toHaveText('27.5%');
```

## Best Practices

- Set up mocks before navigating with `addInitScript()`
- Use `exposeFunction()` for communication between page and test
- Create mock classes for complex state management
- Store mocks on `window` for later access in tests
