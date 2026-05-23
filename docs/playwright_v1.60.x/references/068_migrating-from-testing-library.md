# Migrating from Testing Library

> Source: https://playwright.dev/docs/testing-library

## Background

Playwright's experimental component testing provides an alternative to Testing Library with real browser execution. The query and assertion patterns are similar, making migration straightforward for component tests.

## API Mapping Cheat Sheet

| Testing Library | Playwright |
|-----------------|------------|
| `screen` | `page` and `component` |
| queries | locators |
| async helpers | assertions |
| user events | actions |
| `await user.click(screen.getByText('Click me'))` | `await component.getByText('Click me').click()` |
| `await user.type(screen.getByLabelText('Password'), 'secret')` | `await component.getByLabel('Password').fill('secret')` |
| `expect(screen.getByLabelText('Password')).toHaveValue('secret')` | `await expect(component.getByLabel('Password')).toHaveValue('secret')` |
| `screen.getByRole('button', { pressed: true })` | `component.getByRole('button', { pressed: true })` |
| `screen.getByLabelText('...')` | `component.getByLabel('...')` |
| `screen.queryByPlaceholderText('...')` | `component.getByPlaceholder('...')` |
| `screen.findByText('...')` | `component.getByText('...')` |
| `screen.getByTestId('...')` | `component.getByTestId('...')` |
| `render(<Component />)` | `mount(<Component />)` |
| `const { unmount } = render(<Component />)` | `const { unmount } = await mount(<Component />)` |
| `const { rerender } = render(<Component />)` | `const { update } = await mount(<Component />)` |

## Component Test Example

### Testing Library

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('sign in', async () => {
  const user = userEvent.setup();
  render(<SignInPage />);
  
  await user.type(screen.getByLabelText('Username'), 'John');
  await user.type(screen.getByLabelText('Password'), 'secret');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  
  expect(await screen.findByText('Welcome, John')).toBeInTheDocument();
});
```

### Playwright Test

```typescript
const { test, expect } = require('@playwright/experimental-ct-react');

test('sign in', async ({ mount }) => {
  const component = await mount(<SignInPage />);
  
  await component.getByLabel('Username').fill('John');
  await component.getByLabel('Password').fill('secret');
  await component.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(component.getByText('Welcome, John')).toBeVisible();
});
```

## Key Migration Notes

1. Import from `@playwright/experimental-ct-react` (or `-vue`)
2. Test receives `mount` fixture as parameter
3. Replace `render` with `mount` that returns a locator
4. Use locators for all element interactions
5. Use assertions to verify state

## Replacing waitFor

Playwright assertions auto-wait, eliminating need for explicit waits:

```typescript
// Testing Library
await waitFor(() => {
  expect(getByText('the lion king')).toBeInTheDocument();
});

// Playwright
await expect(page.getByText('the lion king')).toBeVisible();
```

For conditions without suitable assertions, use `expect.poll`:

```typescript
await expect.poll(async () => {
  const response = await page.request.get('https://api.example.com');
  return response.status();
}).toBe(200);
```

## Replacing within

Create scoped locators with `locator.locator()`:

```typescript
// Testing Library
const messages = screen.getByTestId('messages');
const helloMessage = within(messages).getByText('hello');

// Playwright
const messages = component.getByTestId('messages');
const helloMessage = messages.getByText('hello');
```

## Playwright Test Advantages

- Zero-configuration TypeScript support
- Cross-browser testing (Chrome, Firefox, Safari)
- Full support for iframes, tabs, and contexts
- Parallel execution with test isolation
- Built-in artifact collection
- VS Code integration with UI mode
- Playwright Inspector for debugging
- Code generation for test creation
- Tracing for post-mortem debugging

## Best Practices

- Use `mount` for component testing
- Leverage auto-waiting in assertions
- Create scoped locators instead of using `within`
- Take advantage of cross-browser testing
- Enable tracing for debugging failed tests
- Use the VS Code extension for test development
