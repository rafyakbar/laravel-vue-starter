# Assertions

> Source: https://playwright.dev/docs/test-assertions

## Background

Playwright includes test assertions in the form of `expect` function. Playwright provides web-specific async matchers that wait until the expected condition is met, removing flakiness from tests.

## Auto-Retrying Assertions

These assertions retry until they pass or timeout is reached. Must be awaited.

### Element State Assertions

| Assertion | Description |
|-----------|-------------|
| `await expect(locator).toBeAttached()` | Element is attached to DOM |
| `await expect(locator).toBeChecked()` | Checkbox is checked |
| `await expect(locator).toBeDisabled()` | Element is disabled |
| `await expect(locator).toBeEditable()` | Element is editable |
| `await expect(locator).toBeEmpty()` | Container is empty |
| `await expect(locator).toBeEnabled()` | Element is enabled |
| `await expect(locator).toBeFocused()` | Element is focused |
| `await expect(locator).toBeHidden()` | Element is not visible |
| `await expect(locator).toBeInViewport()` | Element intersects viewport |
| `await expect(locator).toBeVisible()` | Element is visible |

### Element Content Assertions

| Assertion | Description |
|-----------|-------------|
| `await expect(locator).toContainText()` | Element contains text |
| `await expect(locator).toContainClass()` | Element has specified CSS classes |
| `await expect(locator).toHaveAccessibleDescription()` | Element has matching accessible description |
| `await expect(locator).toHaveAccessibleName()` | Element has matching accessible name |
| `await expect(locator).toHaveAttribute()` | Element has a DOM attribute |
| `await expect(locator).toHaveClass()` | Element has specified CSS class property |
| `await expect(locator).toHaveCount()` | List has exact number of children |
| `await expect(locator).toHaveCSS()` | Element has CSS property |
| `await expect(locator).toHaveId()` | Element has an ID |
| `await expect(locator).toHaveJSProperty()` | Element has a JavaScript property |
| `await expect(locator).toHaveRole()` | Element has a specific ARIA role |
| `await expect(locator).toHaveText()` | Element matches text |
| `await expect(locator).toHaveValue()` | Input has a value |
| `await expect(locator).toHaveValues()` | Select has options selected |

### Screenshot Assertions

| Assertion | Description |
|-----------|-------------|
| `await expect(locator).toHaveScreenshot()` | Element has a screenshot |
| `await expect(page).toHaveScreenshot()` | Page has a screenshot |

### Page Assertions

| Assertion | Description |
|-----------|-------------|
| `await expect(page).toHaveTitle()` | Page has a title |
| `await expect(page).toHaveURL()` | Page has a URL |
| `await expect(page).toMatchAriaSnapshot()` | Page matches Aria snapshot |

### Response Assertions

| Assertion | Description |
|-----------|-------------|
| `await expect(response).toBeOK()` | Response has OK status |

## Non-Retrying Assertions

These assertions do not auto-retry. Use sparingly for web pages.

| Assertion | Description |
|-----------|-------------|
| `expect(value).toBe()` | Value is the same |
| `expect(value).toBeCloseTo()` | Number is approximately equal |
| `expect(value).toBeDefined()` | Value is not undefined |
| `expect(value).toBeFalsy()` | Value is falsy |
| `expect(value).toBeGreaterThan()` | Number is more than |
| `expect(value).toBeGreaterThanOrEqual()` | Number is more than or equal |
| `expect(value).toBeInstanceOf()` | Object is an instance of a class |
| `expect(value).toBeLessThan()` | Number is less than |
| `expect(value).toBeLessThanOrEqual()` | Number is less than or equal |
| `expect(value).toBeNaN()` | Value is NaN |
| `expect(value).toBeNull()` | Value is null |
| `expect(value).toBeTruthy()` | Value is truthy |
| `expect(value).toBeUndefined()` | Value is undefined |
| `expect(value).toContain()` | String/array contains element |
| `expect(value).toContainEqual()` | Array contains similar element |
| `expect(value).toEqual()` | Deep equality with pattern matching |
| `expect(value).toHaveLength()` | Array or string has length |
| `expect(value).toHaveProperty()` | Object has a property |
| `expect(value).toMatch()` | String matches regex |
| `expect(value).toMatchObject()` | Object contains properties |
| `expect(value).toStrictEqual()` | Strict equality |
| `expect(value).toThrow()` | Function throws an error |

## Asymmetric Matchers

Use in other assertions for relaxed matching:

| Matcher | Description |
|---------|-------------|
| `expect.any()` | Matches any instance of a class/primitive |
| `expect.anything()` | Matches anything |
| `expect.arrayContaining()` | Array contains specific elements |
| `expect.arrayOf()` | Array contains elements of specific type |
| `expect.closeTo()` | Number is approximately equal |
| `expect.objectContaining()` | Object contains specific properties |
| `expect.stringContaining()` | String contains a substring |
| `expect.stringMatching()` | String matches a regex |

## Negating Matchers

```typescript
expect(value).not.toEqual(0);
await expect(locator).not.toContainText('some text');
```

## Soft Assertions

Failed soft assertions don't terminate test execution:

```typescript
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');

// Check for soft assertion failures
expect(test.info().errors).toHaveLength(0);
```

## Custom Expect Message

```typescript
await expect(page.getByText('Name'), 'should be logged in').toBeVisible();
```

## expect.configure

Create pre-configured `expect` instances:

```typescript
const slowExpect = expect.configure({ timeout: 10000 });
await slowExpect(locator).toHaveText('Submit');

const softExpect = expect.configure({ soft: true });
await softExpect(locator).toHaveText('Submit');
```

## expect.poll

Convert synchronous `expect` to asynchronous polling:

```typescript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  message: 'make sure API eventually succeeds',
  timeout: 10000,
}).toBe(200);
```

Custom polling intervals:

```typescript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}, {
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
}).toBe(200);
```

## expect.toPass

Retry blocks of code until passing:

```typescript
await expect(async () => {
  const response = await page.request.get('https://api.example.com');
  expect(response.status()).toBe(200);
}).toPass({
  intervals: [1_000, 2_000, 10_000],
  timeout: 60_000
});
```

## Custom Matchers

Extend Playwright assertions with `expect.extend`:

```typescript
import { expect as baseExpect } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveAmount(locator, expected, options) {
    // ... implementation
  },
});
```

## Best Practices

- Prefer auto-retrying assertions over non-retrying ones
- Use soft assertions when you want to collect multiple failures
- Add custom messages to assertions for better error reporting
- Configure timeout expectations for slow operations
- Use `expect.poll` for polling asynchronous conditions
