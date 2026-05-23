# Handles

> Source: https://playwright.dev/docs/handles

## Background

Playwright can create handles to page DOM elements or other objects. Handles live in the Playwright process while the actual objects live in the browser.

## Types of Handles

- **JSHandle**: Reference to any JavaScript object in the page
- **ElementHandle**: Reference to DOM elements with extra methods for actions

ElementHandle is a subtype of JSHandle since DOM elements are JavaScript objects.

## Creating Handles

```typescript
// Create JSHandle
const jsHandle = await page.evaluateHandle('window');

// Create ElementHandle (discouraged - use Locator instead)
const elementHandle = await page.waitForSelector('#box');
```

## Handles as Parameters

Pass handles to `evaluate()`:

```typescript
// Create handle to array
const myArrayHandle = await page.evaluateHandle(() => {
  window.myArray = [1];
  return myArray;
});

// Use handle in evaluation
const length = await page.evaluate(a => a.length, myArrayHandle);

// Add element using handle
await page.evaluate(arg => arg.myArray.push(arg.newElement), {
  myArray: myArrayHandle,
  newElement: 2
});

// Dispose when done
await myArrayHandle.dispose();
```

## ElementHandle Methods

| Method | Description |
|--------|-------------|
| `boundingBox()` | Get element bounding box |
| `getAttribute()` | Get element attribute |
| `innerText()` | Get inner text |
| `innerHTML()` | Get inner HTML |
| `textContent()` | Get text content |
| `screenshot()` | Take screenshot |
| `click()` | Click element |
| `fill()` | Fill input |
| `focus()` | Focus element |
| `hover()` | Hover element |

## Locator vs ElementHandle

**Discouraged**: ElementHandle points to a specific DOM element that can become stale.

```typescript
// Discouraged - handle can become stale
const handle = await page.$('text=Submit');
await handle.hover();
await handle.click();
```

**Recommended**: Locator captures the logic of how to find an element, re-querying each time.

```typescript
// Recommended - locator finds fresh element each use
const locator = page.getByText('Submit');
await locator.hover();
await locator.click();
```

## Handle Lifecycle

Handles are acquired with `page.evaluateHandle()`, `page.$()`, or `page.$$()`. They retain objects from garbage collection unless:
- Page navigates
- Handle is disposed via `jsHandle.dispose()`

## Best Practices

- Use Locator instead of ElementHandle for user actions and assertions
- Only use ElementHandle for extensive DOM traversal on static pages
- Dispose handles when no longer needed
- Remember handles can become stale if the DOM changes
