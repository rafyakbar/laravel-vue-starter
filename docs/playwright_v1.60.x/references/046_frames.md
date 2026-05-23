# Frames

> Source: https://playwright.dev/docs/frames

## Background

A Page can have one or more Frame objects. Each page has a main frame, and additional frames can be attached with `iframe` HTML tags. Page-level interactions operate in the main frame by default.

## Locating Elements Inside Frames

Use `frameLocator()` to interact with elements inside iframes:

```typescript
// Locate element inside frame
const username = await page.frameLocator('.frame-class').getByLabel('User Name');
await username.fill('John');
```

## Frame Locator Chaining

Chain frame locators for nested frames:

```typescript
const element = page
  .frameLocator('#outer-frame')
  .frameLocator('#inner-frame')
  .getByText('Submit');
await element.click();
```

## Accessing Frame Objects

Get frame objects using `page.frame()`:

```typescript
// Get frame by name attribute
const frame = page.frame('frame-login');

// Get frame by URL
const frame = page.frame({ url: /.*domain.*/ });

// Interact with the frame
await frame.fill('#username-input', 'John');
```

## Frame Methods

| Method | Description |
|--------|-------------|
| `frame.url()` | Get frame URL |
| `frame.title()` | Get frame title |
| `frame.waitForLoadState()` | Wait for frame load |
| `frame.waitForSelector()` | Wait for element in frame |
| `frame.evaluate()` | Execute JavaScript in frame |

## Working with Multiple Frames

```typescript
// Get all frames
const frames = page.frames();

// Iterate frames
for (const frame of page.frames()) {
  console.log(frame.url());
}
```

## Best Practices

- Use `frameLocator()` for most iframe interactions
- Chain frame locators for nested frames
- Use URL patterns for frame matching when name is not available
- Remember that each frame has its own execution context
