# Evaluating JavaScript

> Source: https://playwright.dev/docs/evaluating

## Background

Playwright scripts run in your test environment while page scripts run in the browser. These environments don't intersect - they run in different processes and potentially on different machines. The `page.evaluate()` API runs JavaScript in the browser context and brings results back.

## Basic Usage

```typescript
const href = await page.evaluate(() => document.location.href);
```

If the result is a Promise, evaluate automatically waits:

```typescript
const status = await page.evaluate(async () => {
  const response = await fetch(location.href);
  return response.status;
});
```

## Different Environments

You cannot use variables from your test directly in `evaluate`. Pass them as arguments:

```typescript
// WRONG - "data" doesn't exist in the web page
const data = 'some data';
const result = await page.evaluate(() => {
  window.myApp.use(data); // Error!
});

// CORRECT - pass data as argument
const data = 'some data';
const result = await page.evaluate(data => {
  window.myApp.use(data);
}, data);
```

## Evaluation Arguments

Pass Serializable values and JSHandle instances:

```typescript
// Primitive value
await page.evaluate(num => num, 42);

// Array
await page.evaluate(array => array.length, [1, 2, 3]);

// Object
await page.evaluate(object => object.foo, { foo: 'bar' });

// Single handle
const button = await page.evaluateHandle('window.button');
await page.evaluate(button => button.textContent, button);

// Object with multiple handles
const button1 = await page.evaluateHandle('window.button1');
const button2 = await page.evaluateHandle('window.button2');
await page.evaluate(
  ({ button1, button2 }) => button1.textContent + button2.textContent,
  { button1, button2 }
);

// Object destructuring
await page.evaluate(
  ({ button1, button2 }) => button1.textContent + button2.textContent,
  { button1, button2 }
);

// Array destructuring
await page.evaluate(
  ([b1, b2]) => b1.textContent + b2.textContent,
  [button1, button2]
);
```

## Init Scripts

Run scripts in the page before it starts loading. Use for mocking or test data setup.

### From File

```typescript
// preload.js
Math.random = () => 42;

// In test
import path from 'path';
test.beforeEach(async ({ page }) => {
  await page.addInitScript({
    path: path.resolve(__dirname, '../mocks/preload.js')
  });
});
```

### From Function

```typescript
test.beforeEach(async ({ page }) => {
  const value = 42;
  await page.addInitScript(value => {
    Math.random = () => value;
  }, value);
});
```

## evaluateHandle

Returns a JSHandle instead of a value:

```typescript
const button = await page.evaluateHandle('window.button');
```

## Best Practices

- Pass variables explicitly as arguments to `evaluate`
- Use `addInitScript` for setup before page load
- Remember that test and browser environments are separate
- Use JSHandle when you need a reference to a browser object
- Return serializable data from evaluate functions
