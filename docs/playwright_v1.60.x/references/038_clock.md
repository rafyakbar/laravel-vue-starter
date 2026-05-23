# Clock

> Source: https://playwright.dev/docs/clock

## Background

Accurately simulating time-dependent behavior is essential for verifying application correctness. The Clock API allows developers to manipulate and control time within tests, enabling validation of features like rendering time, timeouts, and scheduled tasks without real-time delays.

## Clock API Methods

| Method | Description |
|--------|-------------|
| `setFixedTime` | Sets fixed time for `Date.now()` and `new Date()` |
| `install` | Initializes clock, allows `pauseAt`, `fastForward`, `runFor`, `resume` |
| `setSystemTime` | Sets current system time (advanced use cases) |

**Recommended:** Use `setFixedTime` for most cases. Use `install` when you need to pause, fast forward, or tick time.

## Overridden Functions

`page.clock` overrides native global classes and functions:
- `Date`
- `setTimeout`, `clearTimeout`
- `setInterval`, `clearInterval`
- `requestAnimationFrame`, `cancelAnimationFrame`
- `requestIdleCallback`, `cancelIdleCallback`
- `performance`
- `Event.timeStamp`

**Warning:** Call `install` before any other clock-related calls. Calling methods out of order results in undefined behavior.

## Test with Predefined Time

Fake `Date.now` while keeping timers going:

```typescript
await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));
await page.goto('http://localhost:3333');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

await page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

## Consistent Time and Timers

For timers that depend on `Date.now`:

```typescript
// Initialize clock with time before test
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// Pause at specific time
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// Fast forward 30 minutes
await page.clock.fastForward('30:00');
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');
```

## Test Inactivity Monitoring

Speed up testing of timeout-based features:

```typescript
await page.clock.install();
await page.goto('http://localhost:3333');

// Interact with the page
await page.getByRole('button').click();

// Fast forward 5 minutes
await page.clock.fastForward('05:00');

// Check automatic logout
await expect(page.getByText('You have been logged out due to inactivity.')).toBeVisible();
```

## Manual Time Control

Tick through time manually for fine-grained control:

```typescript
await page.clock.install({ time: new Date('2024-02-02T08:00:00') });
await page.goto('http://localhost:3333');

// Pause time
await page.clock.pauseAt(new Date('2024-02-02T10:00:00'));
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');

// Tick 2 seconds, firing all timers
await page.clock.runFor(2000);
await expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:02 AM');
```

## Best Practices

- Use `setFixedTime` for simple cases where you need a fixed `Date.now()`
- Use `install` when you need to pause, fast forward, or tick time
- Call `install` before any other clock-related operations
- Use `fastForward` to simulate user closing and reopening a laptop
- Use `runFor` for fine-grained control over timer firing
