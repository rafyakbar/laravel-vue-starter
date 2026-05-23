# Events

> Source: https://playwright.dev/docs/events

## Background

Playwright allows listening to various events on the web page, such as network requests, creation of child pages, and dedicated workers. There are several ways to subscribe to events.

## Waiting for Event

Most commonly, you wait for a specific event to happen.

### Wait for Request

```typescript
// Start waiting for request before goto. Note no await.
const requestPromise = page.waitForRequest('**/*logo*.png');
await page.goto('https://wikipedia.org');
const request = await requestPromise;
console.log(request.url());
```

### Wait for Popup Window

```typescript
// Start waiting for popup before clicking. Note no await.
const popupPromise = page.waitForEvent('popup');
await page.getByText('open the popup').click();
const popup = await popupPromise;
await popup.goto('https://wikipedia.org');
```

### Wait for Response

```typescript
const responsePromise = page.waitForResponse('**/api/data');
await page.getByText('Load data').click();
const response = await responsePromise;
```

## Adding Event Listeners

For events that happen at random times, use event listeners:

```typescript
page.on('request', request => console.log(`Request sent: ${request.url()}`));
const listener = request => console.log(`Request finished: ${request.url()}`);
page.on('requestfinished', listener);

await page.goto('https://wikipedia.org');

page.off('requestfinished', listener);
await page.goto('https://www.openstreetmap.org/');
```

## Common Events

### Page Events

| Event | Description |
|-------|-------------|
| `'close'` | Page closed |
| `'console'` | Console message |
| `'dialog'` | Dialog opened |
| `'download'` | Download started |
| `'filechooser'` | File chooser opened |
| `'frameattached'` | Frame attached |
| `'framedetached'` | Frame detached |
| `'framenavigated'` | Frame navigated |
| `'load'` | Page loaded |
| `'pageerror'` | Uncaught exception |
| `'popup'` | Popup opened |
| `'request'` | Request started |
| `'requestfailed'` | Request failed |
| `'requestfinished'` | Request finished |
| `'response'` | Response received |
| `'worker'` | Web worker created |

### Browser Context Events

| Event | Description |
|-------|-------------|
| `'page'` | Page created |
| `'close'` | Context closed |

## One-Off Listeners

Handle an event once:

```typescript
page.once('dialog', dialog => dialog.accept('2021'));
await page.evaluate("prompt('Enter a number:')");
```

## Multiple Events

Wait for one of multiple events:

```typescript
const result = await Promise.race([
  page.waitForEvent('download'),
  page.waitForEvent('popup'),
]);
```

## Best Practices

- Start waiting for events before triggering actions
- Use `waitForEvent()` for specific event timing
- Use `page.on()` for continuous event handling
- Remove listeners with `page.off()` when done
- Use `page.once()` for one-time event handling
