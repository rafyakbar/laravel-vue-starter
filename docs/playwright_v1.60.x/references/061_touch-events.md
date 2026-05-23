# Touch Events

> Source: https://playwright.dev/docs/touch-events

## Background

Web applications handling legacy touch events for gestures like swipe, pinch, and tap can be tested by dispatching TouchEvents using `locator.dispatchEvent()`. This is useful for testing mobile web applications and touch-based interactions.

Note: `dispatchEvent()` does not set the `Event.isTrusted` property. Disable `isTrusted` checks in your app during testing if needed.

## Emulating Pan Gesture

Pan gestures move touch points across an element:

```typescript
import { test, expect, devices, type Locator } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

async function pan(locator: Locator, deltaX?: number, deltaY?: number, steps?: number) {
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  const touches = [{
    identifier: 0,
    clientX: centerX,
    clientY: centerY,
  }];
  await locator.dispatchEvent('touchstart', { touches, changedTouches: touches, targetTouches: touches });

  steps = steps ?? 5;
  deltaX = deltaX ?? 0;
  deltaY = deltaY ?? 0;

  for (let i = 1; i <= steps; i++) {
    const touches = [{
      identifier: 0,
      clientX: centerX + deltaX * i / steps,
      clientY: centerY + deltaY * i / steps,
    }];
    await locator.dispatchEvent('touchmove', { touches, changedTouches: touches, targetTouches: touches });
  }

  await locator.dispatchEvent('touchend');
}

test('pan gesture to move the map', async ({ page }) => {
  await page.goto('https://www.google.com/maps');
  const map = page.locator('[data-test-id="met"]');
  for (let i = 0; i < 5; i++)
    await pan(map, 200, 100);
  await expect(map).toHaveScreenshot();
});
```

## Emulating Pinch Gesture

Pinch gestures use two touch points moving together or apart:

```typescript
async function pinch(locator: Locator, arg: { deltaX?: number, direction?: 'in' | 'out', steps?: number }) {
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    return {
      centerX: bounds.left + bounds.width / 2,
      centerY: bounds.top + bounds.height / 2
    };
  });

  const deltaX = arg.deltaX ?? 50;
  const steps = arg.steps ?? 5;
  const stepDeltaX = deltaX / (steps + 1);

  // Two touch points equally distant from center
  const touches = [
    { identifier: 0, clientX: centerX - stepDeltaX, clientY: centerY },
    { identifier: 1, clientX: centerX + stepDeltaX, clientY: centerY },
  ];
  await locator.dispatchEvent('touchstart', { touches, changedTouches: touches, targetTouches: touches });

  for (let i = 1; i <= steps; i++) {
    const offset = arg.direction === 'in'
      ? (deltaX - i * stepDeltaX)
      : (stepDeltaX * (i + 1));
    const touches = [
      { identifier: 0, clientX: centerX - offset, clientY: centerY },
      { identifier: 1, clientX: centerX + offset, clientY: centerY },
    ];
    await locator.dispatchEvent('touchmove', { touches, changedTouches: touches, targetTouches: touches });
  }

  await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });
}

test('pinch in gesture to zoom out', async ({ page }) => {
  await page.goto('https://www.google.com/maps');
  const map = page.locator('[data-test-id="met"]');
  await pinch(map, { deltaX: 40, direction: 'in' });
  await expect(map).toHaveScreenshot();
});
```

## Touch Event Properties

Touch events include arrays of touch points:

- `touches`: All current touch points
- `changedTouches`: Touch points that changed in this event
- `targetTouches`: Touch points currently touching the target element

Each touch point contains:
- `identifier`: Unique touch ID
- `clientX`, `clientY`: Viewport-relative coordinates
- `pageX`, `pageY`: Document-relative coordinates
- `screenX`, `screenY`: Screen-relative coordinates

## Device Emulation

Combine touch events with device emulation:

```typescript
test.use({ ...devices['Pixel 7'] });
test.use({ ...devices['iPhone 13'] });
```

## Best Practices

- Use device emulation to match target mobile environments
- Test gestures on actual touch devices when possible
- Handle `isTrusted` check bypassing in test environments
- Use appropriate step counts for smooth gesture simulation
- Consider using higher-level actions like `tap()` for simple interactions
